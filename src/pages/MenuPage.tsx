import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchCategoriesThunk } from "../features/menu/categorySlice";
import { fetchProductsThunk } from "../features/menu/productSlice";
import { CategoryFilter } from "../components/CategoryFilter";
import { SearchBar } from "../components/SearchBar";
import { Alert, Container, Spinner } from "react-bootstrap";
import { ProductCard } from "../components/ProductCard";
import { Link } from "react-router-dom";

export const MenuPage = () => {
  const dispatch = useAppDispatch();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const {
    categories,
    loading: loadingCat,
    error: errorCat,
  } = useAppSelector((state) => state.categories);

  const {
    products,
    loading: loadingProd,
    error: errorProd,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
    dispatch(fetchProductsThunk());
  }, [dispatch]);

  const isLoading = loadingCat || loadingProd;
  const generalError = errorCat || errorProd;

  //Filtro per la ricerca dei prodotti ritorna un prodotto che combacia sia in categoria selezionata
  //al momento della ricerca che per parte del testo scritto

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategoryId !== null
        ? product.categoryId === selectedCategoryId
        : true;

    const query = searchTerm.toLowerCase();

    const matchesName = product.name.toLowerCase().includes(query);
    const matchesIngredient = product.ingredientNames.some((ingredients) =>
      ingredients.toLowerCase().includes(query),
    );
    //Un po' un extra ma se un cliente si ricorda solo della descrizione di un prodotto specifico questo lo aiuterà nella ricerca
    const matchesDescription = product.description
      ? product.description.toLowerCase().includes(query)
      : false;

    //Finchè ritorna true almeno uno di questi 3 controlli il prodotto verrà visualizzato(ovviamente dopo aver tornato true al controllo categoria)
    const matchSearch = matchesName || matchesIngredient || matchesDescription;

    return matchCategory && matchSearch;
  });

  return (
    <Container>
      <div>
        <Link to="/create-order">Crea comanda</Link>
      </div>
      <div>
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(id) => setSelectedCategoryId(id)}
        />
      </div>
      <div>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Cerca nel nostro menu!"
        />
      </div>

      {isLoading && (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="light" />
        </div>
      )}

      {generalError && <Alert variant="danger">{generalError}</Alert>}

      {/* Nel caso non ci siano ne errori ne caricamenti, potrò mostrare le card dei prodotti */}
      {!isLoading && !generalError && (
        <div>
          {filteredProducts.length === 0 ? (
            //Nel caso non ci siano prodotti dopo il filtraggio lancio un messaggio generico per la mancanza di prodotti
            <Alert variant="warning" className="text-center">
              Nessun piatto trovato per i filtri selezionati
            </Alert>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      )}
    </Container>
  );
};
