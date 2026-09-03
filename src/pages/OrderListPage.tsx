import React, { useEffect, useMemo, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { AttiviColumn } from "../components/AttiviColumn";
import { OrderCard } from "../components/OrderCard";
import { OrderFilterHeader } from "../components/OrderFilterHeader";
import {
  appendItemsThunk,
  clearOrderMessages,
  deleteOrderThunk,
  fetchOrderThunk,
  updateOrderStatusThunk,
} from "../features/slices/orderSlice";
import type { OrderItem, OrderStatus, OrderType } from "../interfaces/Order";
import {
  printCancellationTicket,
  printTickets,
  splitItemsByDestination,
} from "../utils/printer";

export const OrdersListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error, successMessage } = useAppSelector(
    (state) => state.orders,
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("ATTIVI");

  // Fetch iniziale con auto aggiornamento ogni 10 secondi
  useEffect(() => {
    dispatch(fetchOrderThunk());

    const intervalId = setInterval(() => {
      dispatch(fetchOrderThunk());
    }, 10000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Auto chiusura delle notifiche
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearOrderMessages());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  // Avanzamento stato
  const handleNextStatus = (orderId: number, currentStatus: OrderStatus) => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      PENDING: "PREPARATION",
      PREPARATION: "READY",
      READY: "SERVED",
      SERVED: "COMPLETED",
      COMPLETED: null,
    };

    const nextStatus = statusFlow[currentStatus];
    if (nextStatus) {
      dispatch(updateOrderStatusThunk({ orderId, status: nextStatus }));
    }
  };

  // Handler per la CANCELLAZIONE della comanda
  const handleCancelOrder = async (
    orderId: number,
    tableNumber?: number | string | null,
    orderType: string = "TAVOLO",
  ) => {
    const result = await dispatch(deleteOrderThunk(orderId));

    if (deleteOrderThunk.fulfilled.match(result)) {
      printCancellationTicket({
        orderId,
        tableNumber,
        orderType,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  };

  // Handler per l'AGGIUNTA piatti a comanda esistente
  const handleAppendToOrder = async (
    orderId: number,
    newOrderItems: OrderItem[],
    tableNumber: string,
    orderType: OrderType,
  ) => {
    const payload = {
      items: newOrderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes || undefined,
      })),
    };

    const result = await dispatch(
      appendItemsThunk({ orderId, items: payload.items }),
    );

    if (appendItemsThunk.fulfilled.match(result)) {
      const tickets = splitItemsByDestination(
        newOrderItems,
        tableNumber,
        orderType,
        true,
        "INTEGRAZIONE COMANDA",
      );
      printTickets(tickets);
    }
  };

  // Filtri gruppi di ordini
  const {
    pendingOrders,
    preparationOrders,
    readyOrders,
    specificFilteredOrders,
  } = useMemo(() => {
    return {
      pendingOrders: orders.filter((o) => o.orderStatus === "PENDING"),
      preparationOrders: orders.filter((o) => o.orderStatus === "PREPARATION"),
      readyOrders: orders.filter((o) => o.orderStatus === "READY"),
      specificFilteredOrders: orders.filter(
        (o) => o.orderStatus === selectedStatus,
      ),
    };
  }, [orders, selectedStatus]);

  return (
    <Container fluid className="py-4 bg-dark text-white min-vh-100">
      <OrderFilterHeader
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {loading && orders.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
        </div>
      ) : selectedStatus === "ATTIVI" ? (
        <Row className="g-3">
          <AttiviColumn
            title="In Attesa"
            orders={pendingOrders}
            status="PENDING"
            emptyMessage="Nessuna comanda in attesa."
            onNextStatus={handleNextStatus}
            onCancelOrder={handleCancelOrder}
          />
          <AttiviColumn
            title="In Preparazione"
            orders={preparationOrders}
            status="PREPARATION"
            emptyMessage="Nessun ordine in cucina."
            onNextStatus={handleNextStatus}
            onCancelOrder={handleCancelOrder}
          />
          <AttiviColumn
            title="Pronti per la Sala"
            orders={readyOrders}
            status="READY"
            emptyMessage="Nessun ordine in attesa di uscita."
            onNextStatus={handleNextStatus}
            onCancelOrder={handleCancelOrder}
          />
        </Row>
      ) : (
        <Row className="g-3">
          {specificFilteredOrders.length === 0 ? (
            <div className="text-center text-muted py-5">
              Nessun ordine trovato per lo stato selezionato.
            </div>
          ) : (
            specificFilteredOrders.map((order) => (
              <Col md={6} lg={4} key={order.id}>
                <OrderCard
                  order={order}
                  onNextStatus={handleNextStatus}
                  onCancelOrder={handleCancelOrder}
                />
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};
