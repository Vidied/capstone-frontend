import React, { useEffect, useMemo, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { AttiviColumn } from "../components/AttiviColumn";
import { OrderCard } from "../components/OrderCard";
import { OrderFilterHeader } from "../components/OrderFilterHeader";
import {
  clearOrderMessages,
  fetchOrderThunk,
  updateOrderStatusThunk,
} from "../features/menu/orderSlice";
import type { OrderStatus } from "../interfaces/Order";

export const OrdersListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error, successMessage } = useAppSelector(
    (state) => state.orders,
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("ATTIVI");

  //Fetch iniziale con auto aggiornamento ogni 10 secondi per la visualizzazione delle nuove comande
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

  //Funzione "switch" per cambio di stato a quello successivo
  const handleNextStatus = (orderId: number, currentStatus: OrderStatus) => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      PENDING: "PREPARATION",
      PREPARATION: "READY",
      READY: "SERVED",
      SERVED: "COMPLETED",
      COMPLETED: null,
      CANCELLED: null,
    };

    const nextStatus = statusFlow[currentStatus];
    if (nextStatus) {
      dispatch(updateOrderStatusThunk({ orderId, status: nextStatus }));
    }
  };

  //Filtri gruppi di ordini per la schermata dei attivi con useMemo per non ricaricare inutilmente se non ci sono cambiamenti
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
      {/* Filtro degli stati */}
      <OrderFilterHeader
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {/* Cuore della pagina, da qui se non viene selezionato nessuna categoria in automatico fa visualizzare una schermata con le 3 schede principali da lavoro */}
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
          />
          <AttiviColumn
            title="In Preparazione"
            orders={preparationOrders}
            status="PREPARATION"
            emptyMessage="Nessun ordine in cucina."
            onNextStatus={handleNextStatus}
          />
          <AttiviColumn
            title="Pronti per la Sala"
            orders={readyOrders}
            status="READY"
            emptyMessage="Nessun ordine in attesa di uscita."
            onNextStatus={handleNextStatus}
          />
        </Row>
      ) : (
        // In caso viene selezionato una categoria si verifica se ci sono ordini in caso positivo la mostra altrimenti ci sta il messaggio di "errore"
        <Row className="g-3">
          {specificFilteredOrders.length === 0 ? (
            <div className="text-center text-muted py-5">
              Nessun ordine trovato per lo stato selezionato.
            </div>
          ) : (
            specificFilteredOrders.map((order) => (
              <Col md={6} lg={4} key={order.id}>
                <OrderCard order={order} onNextStatus={handleNextStatus} />
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};
