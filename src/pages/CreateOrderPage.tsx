import React, { useEffect, useState } from "react";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { CategorySelect } from "../components/CategorySelect";
import { OrderSummary } from "../components/OrderSummary";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import {
  clearOrderMessages,
  createOrderThunk,
} from "../features/menu/orderSlice";
import {
  fetchProductsThunk,
  type Product,
} from "../features/menu/productSlice";
import type { CartItem, OrderRequestDTO, OrderType } from "../interfaces/Order";
import { useDebounce } from "../app/hooks";

export const CreateOrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: RootState) => state.products);
  const { isSubmitting, successMessage, errorMessage } = useSelector(
    (state: RootState) => state.orders,
  );

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("TAVOLO");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [coverCount, setCoverCount] = useState<string>("");
  const [generalNotes, setGeneralNotes] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>("TUTTI");

  useEffect(() => {
    dispatch(fetchProductsThunk());
    return () => {
      dispatch(clearOrderMessages());
    };
  }, [dispatch]);

  // Estrazione dinamica delle categorie uniche dai prodotti
  const availableCategories = Array.from(
    new Set(
      products
        .map((p) => p.categoryName)
        .filter((category): category is string => Boolean(category)),
    ),
  );

  // Controlla se ci sta una voce nel carrello senza note, se ci sta aumenta quello altrimenti ne crea una nuova
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          (!item.notes || item.notes.trim() === ""),
      );

      if (existingIndex !== -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1,
        };
        return newCart;
      }

      return [...prevCart, { product, quantity: 1, notes: "" }];
    });
  };

  // Gestione modali e variazioni sul carrello per Indice
  const handleUpdateQuantityByIndex = (index: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, quantity } : item)),
    );
  };

  const handleUpdateNotesByIndex = (index: number, notes: string) => {
    setCart((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, notes } : item)),
    );
  };

  const handleRemoveItemByIndex = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Invio comanda al backend
  const handleSubmitOrder = async () => {
    dispatch(clearOrderMessages());

    if (cart.length === 0) return;

    const payload: OrderRequestDTO = {
      orderType,
      tableNumber:
        orderType === "TAVOLO" && tableNumber ? Number(tableNumber) : null,
      coverCount:
        orderType === "TAVOLO" && coverCount ? Number(coverCount) : null,
      notes: generalNotes || undefined,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        notes: item.notes || undefined,
      })),
    };

    console.log("Invio payload comanda:", payload);

    const resultAction = await dispatch(createOrderThunk(payload));

    if (createOrderThunk.fulfilled.match(resultAction)) {
      setCart([]);
      setTableNumber("");
      setCoverCount("");
      setGeneralNotes("");
    }
  };

  // Filtro che restituisce prodotti che matchano parte del nome o almeno uno dei ingredienti alla query della ricerca
  const filteredProducts = products.filter((p) => {
    const query = debouncedSearchQuery.toLocaleLowerCase();

    const matchName = p.name.toLowerCase().includes(query);
    const matchIngredients = p.ingredientNames?.some((ingredients) =>
      ingredients.toLocaleLowerCase().includes(query),
    );

    const matchesSearch = matchName || Boolean(matchIngredients);
    const matchesCategory =
      selectedCategory === "TUTTI" ||
      p.categoryName?.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <Container fluid className="py-4 bg-dark text-white min-vh-100">
      <Row className="mb-3">
        <Col>
          <h2>Nuova Comanda</h2>
        </Col>
      </Row>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Row>
        <Col md={7} className="mb-4">
          <Card className="bg-dark text-white border-secondary mb-3">
            <Card.Body>
              <Row className="g-2">
                <Col md={6}>
                  <SearchBar
                    searchTerm={searchQuery}
                    onSearchChange={setSearchQuery}
                    placeholder="Cerca piatto..."
                  />
                </Col>
                <Col md={6}>
                  <CategorySelect
                    selectedCategory={selectedCategory}
                    categories={availableCategories}
                    onCategoryChange={setSelectedCategory}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        {/* Card dei prodotti creati in modo dinamico */}
        <Col md={7} className="mb-4">
          <ProductGrid
            products={filteredProducts}
            isLoading={productsLoading}
            error={productsError}
            onAddToCart={handleAddToCart}
          />
        </Col>
        {/* Riassunto della comanda con tasto di invio */}
        <Col md={5}>
          <OrderSummary
            cart={cart}
            tableNumber={tableNumber}
            coverCount={coverCount}
            orderType={orderType}
            generalNotes={generalNotes}
            onTableNumberChange={setTableNumber}
            onCoverCountChange={setCoverCount}
            onOrderTypeChange={setOrderType}
            onGeneralNotesChange={setGeneralNotes}
            onUpdateQuantity={handleUpdateQuantityByIndex}
            onUpdateNotes={handleUpdateNotesByIndex}
            onRemoveItem={handleRemoveItemByIndex}
            onSubmitOrder={handleSubmitOrder}
            isSubmitting={isSubmitting}
          />
        </Col>
      </Row>
    </Container>
  );
};
