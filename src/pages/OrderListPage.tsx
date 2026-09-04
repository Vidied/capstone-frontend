import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { AttiviColumn } from "../components/AttiviColumn";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { OrderCard } from "../components/OrderCard";
import { OrderFilterHeader } from "../components/OrderFilterHeader";
import {
  clearOrderMessages,
  deleteCompletedOrdersThunk,
  deleteOrdersThunk,
  fetchOrdersThunk,
  updateOrderStatusThunk,
} from "../features/slices/orderSlice";
import type { Order, OrderStatus } from "../interfaces/Order";
import {
  printCancellationTicket,
  printFullOrderTicket,
} from "../utils/printer";

export const OrdersListPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, errorMessage, successMessage } = useAppSelector(
    (state) => state.orders,
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("ATTIVI");
  const [showBulkDeleteModal, setShowBulkDeleteModal] =
    useState<boolean>(false);

  const [autoPrintOnComplete, setAutoPrintOnComplete] = useState<boolean>(
    () => localStorage.getItem("autoPrintOnComplete") === "true",
  );

  const handleToggleAutoPrint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAutoPrintOnComplete(checked);
    localStorage.setItem("autoPrintOnComplete", String(checked));
  };

  useEffect(() => {
    dispatch(fetchOrdersThunk());

    const intervalId = setInterval(() => {
      dispatch(fetchOrdersThunk());
    }, 10000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearOrderMessages());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage, dispatch]);

  const handlePrintFullTicket = (order: Order) => {
    printFullOrderTicket(order);
  };

  const handleDeleteSingleOrder = (orderId: number) => {
    dispatch(deleteOrdersThunk(orderId));
  };

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
      if (
        currentStatus === "SERVED" &&
        nextStatus === "COMPLETED" &&
        autoPrintOnComplete
      ) {
        const orderToPrint = orders.find((o) => o.id === orderId);
        if (orderToPrint) {
          handlePrintFullTicket(orderToPrint);
        }
      }

      dispatch(
        updateOrderStatusThunk({
          orderId,
          data: { orderStatus: nextStatus },
        }),
      );
    }
  };

  const handleCancelOrder = async (
    orderId: number,
    tableNumber?: number | string | null,
    orderType: string = "TAVOLO",
  ) => {
    const result = await dispatch(deleteOrdersThunk(orderId));

    if (deleteOrdersThunk.fulfilled.match(result)) {
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

  const handleConfirmDeleteCompleted = () => {
    dispatch(deleteCompletedOrdersThunk());
    setShowBulkDeleteModal(false);
  };

  const {
    pendingOrders,
    preparationOrders,
    readyOrders,
    specificFilteredOrders,
    completedCount,
  } = useMemo(() => {
    return {
      pendingOrders: orders.filter((o) => o.orderStatus === "PENDING"),
      preparationOrders: orders.filter((o) => o.orderStatus === "PREPARATION"),
      readyOrders: orders.filter((o) => o.orderStatus === "READY"),
      specificFilteredOrders: orders.filter(
        (o) => o.orderStatus === selectedStatus,
      ),
      completedCount: orders.filter((o) => o.orderStatus === "COMPLETED")
        .length,
    };
  }, [orders, selectedStatus]);

  const rightAction = useMemo(() => {
    if (selectedStatus === "SERVED") {
      return (
        <Form.Check
          type="switch"
          id="auto-print-switch"
          label="Stampa automatica all'incasso"
          checked={autoPrintOnComplete}
          onChange={handleToggleAutoPrint}
          className="text-secondary fw-semibold mb-0"
        />
      );
    }
    if (selectedStatus === "COMPLETED" && completedCount > 0) {
      return (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => setShowBulkDeleteModal(true)}
        >
          Pulisci Completati ({completedCount})
        </Button>
      );
    }
    return null;
  }, [selectedStatus, autoPrintOnComplete, completedCount]);

  return (
    <Container
      fluid
      className="py-4 min-vh-100"
      style={{ backgroundColor: "#f7f4ee", color: "#2b2b2b" }}
    >
      <OrderFilterHeader
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        rightAction={rightAction}
      />

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {loading && orders.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="dark" />
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
            onPrintTicket={handlePrintFullTicket}
            onDeleteSingleOrder={handleDeleteSingleOrder}
          />
          <AttiviColumn
            title="In Preparazione"
            orders={preparationOrders}
            status="PREPARATION"
            emptyMessage="Nessun ordine in cucina."
            onNextStatus={handleNextStatus}
            onCancelOrder={handleCancelOrder}
            onPrintTicket={handlePrintFullTicket}
            onDeleteSingleOrder={handleDeleteSingleOrder}
          />
          <AttiviColumn
            title="Pronti per la Sala"
            orders={readyOrders}
            status="READY"
            emptyMessage="Nessun ordine in attesa di uscita."
            onNextStatus={handleNextStatus}
            onCancelOrder={handleCancelOrder}
            onPrintTicket={handlePrintFullTicket}
            onDeleteSingleOrder={handleDeleteSingleOrder}
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
                  onPrintTicket={handlePrintFullTicket}
                  onDeleteSingleOrder={handleDeleteSingleOrder}
                />
              </Col>
            ))
          )}
        </Row>
      )}

      <ConfirmDeleteModal
        show={showBulkDeleteModal}
        title="Conferma Eliminazione di Massa"
        message={`Sei sicuro di voler eliminare tutti gli ordini completati (${completedCount})?`}
        confirmButtonText="Elimina Tutti i Completati"
        onHide={() => setShowBulkDeleteModal(false)}
        onConfirm={handleConfirmDeleteCompleted}
      />
    </Container>
  );
};
