import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Col,
  Container,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CategoryModal } from "../components/CategoryModal";
import { IngredientModal } from "../components/IngredientModal";
import { ProductModal } from "../components/ProductModal";
import { SearchBar } from "../components/SearchBar"; // Importato la tua SearchBar

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
} from "../features/menu/categorySlice";
import {
  createIngredientThunk,
  deleteIngredientThunk,
  fetchIngredientsThunk,
  updateIngredientThunk,
} from "../features/menu/ingredientSlice";
import {
  createProductThunk,
  deleteProductThunk,
  fetchProductsThunk,
  updateProductThunk,
} from "../features/menu/productSlice";
import { getSearchPlaceholder } from "../interfaces/MenuHelpers";

export const MenuManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("products");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      const dto: ProductRequestDTO = {
        name: product.name,
        description: product.description,
        price: product.price,
        isAvailable: !product.isAvailable,
        categoryId: product.categoryId ?? product.category?.id ?? 0,
        ingredientIds: product.ingredients?.map((ing) => ing.id) ?? [],
      };
      await dispatch(
        updateProductThunk({ id: product.id, data: dto }),
      ).unwrap();
    } catch (err) {
      console.error("Errore switch disponibilità prodotto:", err);
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
    } catch (err) {
      console.error("Errore switch disponibilità ingrediente:", err);
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
    } catch (err) {
      alert(`Errore nel salvataggio del prodotto: ${err}`);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      try {
        await dispatch(deleteProductThunk(id)).unwrap();
      } catch (err) {
        alert(`Errore durante l'eliminazione: ${err}`);
      }
    }
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
    } catch (err) {
      alert(`Errore nel salvataggio della categoria: ${err}`);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm("Sei sicuro di voler eliminare questa categoria?")) {
      try {
        await dispatch(deleteCategoryThunk(id)).unwrap();
        dispatch(fetchCategoriesThunk());
        dispatch(fetchProductsThunk());
      } catch (err) {
        alert(`Errore durante l'eliminazione: ${err}`);
      }
    }
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
    } catch (err) {
      alert(`Errore nel salvataggio dell'ingrediente: ${err}`);
    }
  };

  const handleDeleteIngredient = async (id: number) => {
    if (window.confirm("Sei sicuro di voler eliminare questo ingrediente?")) {
      try {
        await dispatch(deleteIngredientThunk(id)).unwrap();
        dispatch(fetchProductsThunk());
      } catch (err) {
        alert(`Errore durante l'eliminazione: ${err}`);
      }
    }
  };

  const isLoading = productsLoading || categoriesLoading || ingredientsLoading;
  const globalError = productsError || categoriesError || ingredientsError;

  return (
    <Container fluid className="py-4 bg-dark text-white min-vh-100">
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h2 className="mb-1">Gestione Menu & Magazzino</h2>
        </Col>
        <Col
          md={6}
          className="d-flex justify-content-start justify-content-end align-items-center mt-3 mt-md-0 gap-3"
        >
          <div style={{ maxWidth: "300px", width: "100%" }}>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder={getSearchPlaceholder(activeTab)}
            />
          </div>
          {isLoading && (
            <Spinner animation="border" variant="light" size="sm" />
          )}
        </Col>
      </Row>

      {globalError && (
        <Alert variant="danger" className="mb-4">
          {globalError}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={handleTabSelect}
        className="mb-4 border-secondary custom-tabs"
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
            onDelete={handleDeleteProduct}
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
            onDelete={handleDeleteIngredient}
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
            onDelete={handleDeleteCategory}
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
    </Container>
  );
};
