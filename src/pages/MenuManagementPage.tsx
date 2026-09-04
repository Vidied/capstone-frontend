import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Col,
  Container,
  Row,
  Spinner,
  Tab,
  Tabs,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CategoryModal } from "../components/CategoryModal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { IngredientModal } from "../components/IngredientModal";
import { ProductModal } from "../components/ProductModal";
import { SearchBar } from "../components/SearchBar";

import { CategoriesTable } from "../components/CategoriesTable";
import { IngredientsTable } from "../components/IngredientsTable";
import { ProductsTable } from "../components/ProductsTable";

import type {
  Category,
  CategoryRequestDTO,
  Ingredient,
  IngredientRequestDTO,
  Product,
  ProductRequestDTO,
} from "../interfaces/Product";

import {
  createCategoryThunk,
  deleteCategoryThunk,
  fetchCategoriesThunk,
  updateCategoryThunk,
} from "../features/slices/categorySlice";
import {
  createIngredientThunk,
  deleteIngredientThunk,
  fetchIngredientsThunk,
  updateIngredientThunk,
} from "../features/slices/ingredientSlice";
import {
  createProductThunk,
  deleteProductThunk,
  fetchProductsThunk,
  toggleProductAvailabilityThunk,
  updateProductThunk,
} from "../features/slices/productSlice";
import { getSearchPlaceholder } from "../interfaces/MenuHelpers";

export const MenuManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("products");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Stato per il modale di conferma eliminazione unificato
  const [deleteModalState, setDeleteModalState] = useState<{
    show: boolean;
    type: "product" | "ingredient" | "category" | null;
    id: number | null;
    name: string;
  }>({
    show: false,
    type: null,
    id: null,
    name: "",
  });

  const getErrorMessage = (err: unknown, defaultMsg: string): string => {
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    return defaultMsg;
  };

  const triggerErrorToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAppSelector((state) => state.categories);
  const {
    ingredients,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useAppSelector((state) => state.ingredients);
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsThunk());
    dispatch(fetchCategoriesThunk());
    dispatch(fetchIngredientsThunk());
  }, [dispatch]);

  const handleTabSelect = (k: string | null) => {
    if (k) {
      setActiveTab(k);
      setSearchTerm("");
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category?.name.toLowerCase().includes(term) ||
        p.ingredients?.some((ing) => ing.name.toLowerCase().includes(term)),
    );
  }, [products, searchTerm]);

  const filteredIngredients = useMemo(() => {
    if (!searchTerm.trim()) return ingredients;
    const term = searchTerm.toLowerCase();
    return ingredients.filter((ing) => ing.name.toLowerCase().includes(term));
  }, [ingredients, searchTerm]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(term));
  }, [categories, searchTerm]);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null,
  );

  const handleToggleProductAvailability = async (product: Product) => {
    try {
      await dispatch(toggleProductAvailabilityThunk(product.id)).unwrap();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(
        err,
        "Impossibile modificare la disponibilità del prodotto.",
      );
      triggerErrorToast(errorMessage);
      dispatch(fetchProductsThunk());
    }
  };

  const handleToggleIngredientAvailability = async (ingredient: Ingredient) => {
    try {
      const dto: IngredientRequestDTO = {
        name: ingredient.name,
        isAvailable: !ingredient.isAvailable,
      };
      await dispatch(
        updateIngredientThunk({ id: ingredient.id, data: dto }),
      ).unwrap();
      dispatch(fetchProductsThunk());
    } catch (err: unknown) {
      triggerErrorToast(
        getErrorMessage(
          err,
          "Impossibile modificare la disponibilità dell'ingrediente.",
        ),
      );
      dispatch(fetchIngredientsThunk());
    }
  };

  const handleSaveProduct = async (dto: ProductRequestDTO, id?: number) => {
    try {
      if (id) {
        await dispatch(updateProductThunk({ id, data: dto })).unwrap();
      } else {
        await dispatch(createProductThunk(dto)).unwrap();
      }
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (err: unknown) {
      triggerErrorToast(
        `Errore nel salvataggio del prodotto: ${getErrorMessage(err, "Errore sconosciuto")}`,
      );
    }
  };

  // Apertura modale di conferma per Prodotto
  const handleDeleteProductPrompt = (id: number) => {
    const prod = products.find((p) => p.id === id);
    setDeleteModalState({
      show: true,
      type: "product",
      id,
      name: prod?.name || "questo prodotto",
    });
  };

  const handleSaveCategory = async (dto: CategoryRequestDTO, id?: number) => {
    try {
      if (id) {
        await dispatch(updateCategoryThunk({ id, data: dto })).unwrap();
      } else {
        await dispatch(createCategoryThunk(dto)).unwrap();
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      dispatch(fetchCategoriesThunk());
      dispatch(fetchProductsThunk());
    } catch (err: unknown) {
      triggerErrorToast(
        `Errore nel salvataggio della categoria: ${getErrorMessage(err, "Errore sconosciuto")}`,
      );
    }
  };

  // Apertura modale di conferma per Categoria
  const handleDeleteCategoryPrompt = (id: number) => {
    const cat = categories.find((c) => c.id === id);
    setDeleteModalState({
      show: true,
      type: "category",
      id,
      name: cat?.name || "questa categoria",
    });
  };

  const handleSaveIngredient = async (
    dto: IngredientRequestDTO,
    id?: number,
  ) => {
    try {
      if (id) {
        await dispatch(updateIngredientThunk({ id, data: dto })).unwrap();
      } else {
        await dispatch(createIngredientThunk(dto)).unwrap();
      }
      setShowIngredientModal(false);
      setEditingIngredient(null);
      dispatch(fetchIngredientsThunk());
      dispatch(fetchProductsThunk());
    } catch (err: unknown) {
      triggerErrorToast(
        `Errore nel salvataggio dell'ingrediente: ${getErrorMessage(err, "Errore sconosciuto")}`,
      );
    }
  };

  // Apertura modale di conferma per Ingrediente
  const handleDeleteIngredientPrompt = (id: number) => {
    const ing = ingredients.find((i) => i.id === id);
    setDeleteModalState({
      show: true,
      type: "ingredient",
      id,
      name: ing?.name || "questo ingrediente",
    });
  };

  // Esecuzione effettiva dell'eliminazione confermata
  const handleConfirmDelete = async () => {
    const { type, id } = deleteModalState;
    if (id === null || !type) return;

    try {
      if (type === "product") {
        await dispatch(deleteProductThunk(id)).unwrap();
      } else if (type === "category") {
        await dispatch(deleteCategoryThunk(id)).unwrap();
        dispatch(fetchCategoriesThunk());
        dispatch(fetchProductsThunk());
      } else if (type === "ingredient") {
        await dispatch(deleteIngredientThunk(id)).unwrap();
        dispatch(fetchProductsThunk());
      }
    } catch (err: unknown) {
      triggerErrorToast(
        `Errore durante l'eliminazione: ${getErrorMessage(err, "Errore sconosciuto")}`,
      );
    } finally {
      setDeleteModalState({ show: false, type: null, id: null, name: "" });
    }
  };

  const isLoading = productsLoading || categoriesLoading || ingredientsLoading;
  const globalError = productsError || categoriesError || ingredientsError;

  return (
    <Container
      fluid
      className="py-4 min-vh-100 position-relative"
      style={{ backgroundColor: "#f7f4ee", color: "#2b2b2b" }}
    >
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1055 }}
      >
        <Toast
          bg="danger"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
        >
          <Toast.Header closeButton>
            <strong className="me-auto text-white">Attenzione</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h2 className="mb-1 fw-bold" style={{ color: "#2b2b2b" }}>
            Gestione Menu & Magazzino
          </h2>
        </Col>
        <Col
          md={6}
          className="d-flex justify-content-start justify-content-md-end align-items-center mt-3 mt-md-0 gap-3"
        >
          <div style={{ maxWidth: "300px", width: "100%" }}>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder={getSearchPlaceholder(activeTab)}
            />
          </div>
          {isLoading && <Spinner animation="border" variant="dark" size="sm" />}
        </Col>
      </Row>

      {globalError && (
        <Alert variant="danger" className="mb-4 shadow-sm">
          {globalError}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={handleTabSelect}
        className="mb-4 border-bottom"
      >
        <Tab
          eventKey="products"
          title={`Prodotti (${filteredProducts.length})`}
        >
          <ProductsTable
            products={filteredProducts}
            isLoading={productsLoading}
            onAddNew={() => {
              setEditingProduct(null);
              setShowProductModal(true);
            }}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowProductModal(true);
            }}
            onDelete={handleDeleteProductPrompt}
            onToggleAvailability={handleToggleProductAvailability}
          />
        </Tab>

        <Tab
          eventKey="ingredients"
          title={`Ingredienti (${filteredIngredients.length})`}
        >
          <IngredientsTable
            ingredients={filteredIngredients}
            isLoading={ingredientsLoading}
            onAddNew={() => {
              setEditingIngredient(null);
              setShowIngredientModal(true);
            }}
            onEdit={(ingredient) => {
              setEditingIngredient(ingredient);
              setShowIngredientModal(true);
            }}
            onDelete={handleDeleteIngredientPrompt}
            onToggleAvailability={handleToggleIngredientAvailability}
          />
        </Tab>

        <Tab
          eventKey="categories"
          title={`Categorie (${filteredCategories.length})`}
        >
          <CategoriesTable
            categories={filteredCategories}
            isLoading={categoriesLoading}
            onAddNew={() => {
              setEditingCategory(null);
              setShowCategoryModal(true);
            }}
            onEdit={(category) => {
              setEditingCategory(category);
              setShowCategoryModal(true);
            }}
            onDelete={handleDeleteCategoryPrompt}
          />
        </Tab>
      </Tabs>

      {showProductModal && (
        <ProductModal
          key={editingProduct ? `prod-${editingProduct.id}` : "prod-new"}
          show={showProductModal}
          onHide={() => setShowProductModal(false)}
          onSubmit={handleSaveProduct}
          productToEdit={editingProduct}
          categories={categories}
          ingredients={ingredients}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          key={editingCategory ? `cat-${editingCategory.id}` : "cat-new"}
          show={showCategoryModal}
          onHide={() => setShowCategoryModal(false)}
          onSubmit={handleSaveCategory}
          categoryToEdit={editingCategory}
          categories={categories}
        />
      )}

      {showIngredientModal && (
        <IngredientModal
          show={showIngredientModal}
          onHide={() => {
            setShowIngredientModal(false);
            setEditingIngredient(null);
          }}
          onSubmit={handleSaveIngredient}
          ingredientToEdit={editingIngredient}
        />
      )}

      {/* Modale unificato di conferma eliminazione */}
      <ConfirmDeleteModal
        show={deleteModalState.show}
        onHide={() =>
          setDeleteModalState({ show: false, type: null, id: null, name: "" })
        }
        onConfirm={handleConfirmDelete}
        title="Conferma Eliminazione"
        message={`Sei sicuro di voler eliminare "${deleteModalState.name}"? Questa azione non può essere annullata.`}
      />
    </Container>
  );
};
