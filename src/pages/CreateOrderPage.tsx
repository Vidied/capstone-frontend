import React, { useEffect, useMemo, useState } from "react";
import { Alert, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../app/hooks";
import type { AppDispatch, RootState } from "../app/store";
import { CategorySelect } from "../components/CategorySelect";
import { OrderSummary } from "../components/OrderSummary";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import {
  appendItemsThunk,
  clearOrderMessages,
  createOrderThunk,
  fetchOrdersThunk,
} from "../features/slices/orderSlice";
import { fetchProductsThunk } from "../features/slices/productSlice";
import type { CartItem, OrderRequestDTO, OrderType } from "../interfaces/Order";
import type { Product } from "../interfaces/Product";
import { printTickets, splitItemsByDestination } from "../utils/printer";

export const CreateOrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: RootState) => state.products);

  const { orders, isSubmitting, successMessage, errorMessage } = useSelector(
    (state: RootState) => state.orders,
  );

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("TAVOLO");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [coverCount, setCoverCount] = useState<string>("");
  const [generalNotes, setGeneralNotes] = useState<string>("");

  const [isExtraOrder, setIsExtraOrder] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>("TUTTI");

  useEffect(() => {
    dispatch(fetchProductsThunk());
    dispatch(fetchOrdersThunk());
    return () => {
      dispatch(clearOrderMessages());
    };
  }, [dispatch]);

  const activeOrderForTable = useMemo(() => {
    if (orderType !== "TAVOLO" || !tableNumber) return null;
    const tableNum = Number(tableNumber);
    return orders.find(
      (o) => o.tableNumber === tableNum && o.orderStatus !== "COMPLETED",
    );
  }, [orders, orderType, tableNumber]);

  const handleTableChange = (value: string) => {
    setTableNumber(value);
    const tableNum = Number(value);

    const activeOrder = orders.find(
      (o) =>
        o.tableNumber === tableNum &&
        o.orderStatus !== "COMPLETED" &&
        o.orderStatus !== "CANCELLED",
    );

    if (activeOrder) {
      setIsExtraOrder(true);
      if (
        activeOrder.coverCount !== null &&
        activeOrder.coverCount !== undefined
      ) {
        setCoverCount(String(activeOrder.coverCount));
      }
    } else {
      setIsExtraOrder(false);
    }
  };

  const availableCategories = Array.from(
    new Set(
      products
        .filter((p) => p.isAvailable)
        .map((p) => p.categoryName)
        .filter((category): category is string => Boolean(category)),
    ),
  );

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

  const resetForm = () => {
    setCart([]);
    setTableNumber("");
    setCoverCount("");
    setGeneralNotes("");
    setIsExtraOrder(false);
  };

  const handleSubmitOrder = async () => {
    dispatch(clearOrderMessages());

    if (cart.length === 0) return;

    if (isExtraOrder && activeOrderForTable) {
      const newCoverCountNumber = coverCount ? Number(coverCount) : null;

      const coverCountHasChanged =
        activeOrderForTable.coverCount !== newCoverCountNumber;

      const payloadItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        notes: item.notes || undefined,
      }));

      const resultAction = await dispatch(
        appendItemsThunk({
          orderId: activeOrderForTable.id,
          items: payloadItems,
          ...(coverCountHasChanged && newCoverCountNumber !== null
            ? { coverCount: newCoverCountNumber }
            : {}),
        }),
      );

      if (appendItemsThunk.fulfilled.match(resultAction)) {
        const tickets = splitItemsByDestination(
          cart,
          tableNumber,
          orderType,
          true,
          generalNotes,
        );
        printTickets(tickets);
        resetForm();
      }
      return;
    }

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

    const resultAction = await dispatch(createOrderThunk(payload));

    if (createOrderThunk.fulfilled.match(resultAction)) {
      const tickets = splitItemsByDestination(
        cart,
        tableNumber,
        orderType,
        false,
        generalNotes,
      );
      printTickets(tickets);
      resetForm();
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!p.isAvailable) return false;

    const query = debouncedSearchQuery.toLowerCase();
    const productName = (p.name || "").toLowerCase();
    const matchName = productName.includes(query);
    const matchIngredients = p.ingredientNames?.some((ingredient) =>
      ingredient?.toLowerCase().includes(query),
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

      {orderType === "TAVOLO" && activeOrderForTable && (
        <Alert
          variant="warning"
          className="d-flex justify-content-between align-items-center mb-4"
        >
          <div>
            <strong>Tavolo {tableNumber} ha già un ordine aperto!</strong>
          </div>
          <Form.Check
            type="switch"
            id="extra-order-switch"
            label="Invia come Extra"
            checked={isExtraOrder}
            onChange={(e) => setIsExtraOrder(e.target.checked)}
          />
        </Alert>
      )}

      {/* Barra di ricerca e filtro categorie sempre in alto */}
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

      <Row>
        {/*
          Su Mobile (sm e inferiori): OrderSummary appare PER PRIMO (order-1)
          Su Desktop (md e superiori): OrderSummary appare a DESTRA (order-md-2)
        */}
        <Col md={5} className="order-1 order-md-2 mb-4">
          <OrderSummary
            cart={cart}
            tableNumber={tableNumber}
            coverCount={coverCount}
            orderType={orderType}
            generalNotes={generalNotes}
            onTableNumberChange={handleTableChange}
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

        {/*
          Su Mobile (sm e inferiori): ProductGrid appare DOPO lo Summary (order-2)
          Su Desktop (md e superiori): ProductGrid appare a SINISTRA (order-md-1)
        */}
        <Col md={7} className="order-2 order-md-1 mb-4">
          <ProductGrid
            products={filteredProducts}
            isLoading={productsLoading}
            error={productsError}
            onAddToCart={handleAddToCart}
          />
        </Col>
      </Row>
    </Container>
  );
};
