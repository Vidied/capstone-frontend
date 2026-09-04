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
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="btn btn-dark rounded-circle shadow position-fixed d-flex align-items-center justify-content-center"
          style={{
            bottom: "2rem",
            right: "2rem",
            width: "45px",
            height: "45px",
            zIndex: 1040,
            backgroundColor: "#1a1a1a",
            borderColor: "#1a1a1a",
            opacity: 0.9,
            transition: "opacity 0.2s ease-in-out",
          }}
          title="Torna in cima"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-white"
          >
            <path
              fillRule="evenodd"
              d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
