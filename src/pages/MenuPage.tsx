import { useEffect, useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CategoryFilter } from "../components/CategoryFilter";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";
import { fetchCategoriesThunk } from "../features/slices/categorySlice";
import { fetchProductsThunk } from "../features/slices/productSlice";

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

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategoryId !== null
        ? product.categoryId === selectedCategoryId
        : true;

    const query = searchTerm.toLowerCase();

    const matchesName = product.name.toLowerCase().includes(query);

    const rawIngredients = product.ingredientNames || product.ingredients || [];

    const matchesIngredient = rawIngredients.some((ing) => {
      if (!ing) return false;

      const ingredientName = typeof ing === "string" ? ing : ing.name;
      return ingredientName
        ? ingredientName.toLowerCase().includes(query)
        : false;
    });

    const matchesDescription = product.description
      ? product.description.toLowerCase().includes(query)
      : false;

    const matchSearch = matchesName || matchesIngredient || matchesDescription;

    return matchCategory && matchSearch;
  });

  return (
    <div className="menu-page-bg min-vh-100 py-4 position-relative">
      <Container>
        <div className="mb-3">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Cerca piatto o ingrediente..."
          />
        </div>

        <div className="mb-4 pb-2 border-bottom border-dark-subtle">
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => setSelectedCategoryId(id)}
          />
        </div>

        {isLoading && (
          <div className="text-center my-5 py-5">
            <Spinner animation="border" variant="dark" />
          </div>
        )}

        {generalError && <Alert variant="danger">{generalError}</Alert>}

        {!isLoading && !generalError && (
          <div>
            {filteredProducts.length === 0 ? (
              <Alert variant="warning" className="text-center mt-3">
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
    </div>
  );
};
