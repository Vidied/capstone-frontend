import React, { useState } from "react";
import { Badge, Button, Card, ListGroup, Modal } from "react-bootstrap";
import {
  getBadgeVariant,
  getNextStatusLabel,
  type Order,
  type OrderStatus,
} from "../interfaces/Order";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { OrderListItem } from "./OrderListItem";

interface OrderCardProps {
  order: Order;
  onNextStatus: (orderId: number, currentStatus: OrderStatus) => void;
  onCancelOrder?: (
    orderId: number,
    tableNumber?: number | string | null,
    orderType?: string,
  ) => void;
  onPrintTicket?: (order: Order) => void;
  onDeleteSingleOrder?: (orderId: number) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onNextStatus,
  onCancelOrder,
  onPrintTicket,
  onDeleteSingleOrder,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isTable =
    order.orderType === "TAVOLO" ||
    (order.tableNumber !== null && order.tableNumber !== undefined);

  const isServed = order.orderStatus === "SERVED";
  const isCompleted = order.orderStatus === "COMPLETED";

  const handleConfirmCancel = () => {
    if (onCancelOrder) {
      onCancelOrder(order.id, order.tableNumber, order.orderType);
    }
    setShowCancelModal(false);
  };

  const handleConfirmDelete = () => {
    if (onDeleteSingleOrder) {
      onDeleteSingleOrder(order.id);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <Card className="bg-dark text-white border-secondary mb-3 shadow-sm h-100">
        <Card.Header className="border-secondary d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-5">
            {isTable ? `Tavolo ${order.tableNumber}` : "Asporto"}
          </span>
          <Badge bg={getBadgeVariant(order.orderStatus)} text="dark">
            {order.orderStatus}
          </Badge>
        </Card.Header>

        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex justify-content-between small text-muted mb-2">
              <span>
                Ora:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </span>
              {isTable &&
                order.coverCount !== undefined &&
                order.coverCount !== null && (
                  <span>Coperti: {order.coverCount}</span>
                )}
            </div>

            <ListGroup variant="flush" className="mb-3 rounded">
              {order.items?.map((item, index) => (
                <OrderListItem key={item.id ?? index} item={item} />
              ))}
            </ListGroup>

            {order.notes && (
              <p className="small text-info mb-2">
                <strong>Note Ordine:</strong> {order.notes}
              </p>
            )}
          </div>

          <div>
            <div className="fw-bold text-success fs-5 mb-2">
              Totale: €{" "}
              {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
            </div>

            {isCompleted ? (
              <div className="d-flex gap-2">
                {onPrintTicket && (
                  <Button
                    size="sm"
                    variant="outline-info"
                    className="fw-bold"
                    onClick={() => onPrintTicket(order)}
                  >
                    Stampa
                  </Button>
                )}
                {onDeleteSingleOrder && (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="flex-grow-1 fw-bold"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Elimina Definitivamente
                  </Button>
                )}
              </div>
            ) : (
              /* Azioni per ordini attivi / serviti */
              <div className="d-flex gap-2 flex-wrap">
                {(isServed || onPrintTicket) && onPrintTicket && (
                  <Button
                    size="sm"
                    variant="outline-info"
                    className="fw-bold"
                    onClick={() => onPrintTicket(order)}
                  >
                    Stampa Scontrino
                  </Button>
                )}

                <Button
                  size="sm"
                  variant={
                    order.orderStatus === "READY" || isServed
                      ? "success"
                      : "outline-success"
                  }
                  className="flex-grow-1 fw-bold"
                  onClick={() => onNextStatus(order.id, order.orderStatus)}
                >
                  {getNextStatusLabel(order.orderStatus)}
                </Button>

                {onCancelOrder && (
                  <Button
                    size="sm"
                    variant="danger"
                    className="fw-bold px-3"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Annulla
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Modale per Annullamento Ordine Attivo */}
      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
        contentClassName="bg-dark text-white border-secondary"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-secondary"
        >
          <Modal.Title className="fs-5 text-danger">
            Conferma Annullamento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sei sicuro di voler annullare l'ordine per{" "}
          <strong>
            {isTable ? `il Tavolo ${order.tableNumber}` : "l'Asporto"}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Chiudi
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Conferma Annullamento
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modale per Eliminazione Singola Ordine Completato */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        title={`Elimina Ordine #${order.id}`}
        message={`Sei sicuro di voler eliminare definitivamente l'ordine per ${
          isTable ? `il Tavolo ${order.tableNumber}` : "l'Asporto"
        }?`}
        confirmButtonText="Elimina Ordine"
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
