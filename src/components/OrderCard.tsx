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
      <Card
        className="bg-white text-dark shadow-sm h-100 mb-3"
        style={{ border: "1px solid #ced4da" }}
      >
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
          <span className="fw-bold fs-5" style={{ color: "#2b2b2b" }}>
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

            <ListGroup variant="flush" className="mb-3 rounded border">
              {order.items?.map((item, index) => (
                <OrderListItem key={item.id ?? index} item={item} />
              ))}
            </ListGroup>

            {order.notes && (
              <p className="small text-primary mb-2">
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
                    variant="outline-secondary"
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
              <div className="d-flex gap-2 flex-wrap">
                {isServed && onPrintTicket && (
                  <Button
                    size="sm"
                    variant="outline-dark"
                    className="fw-bold"
                    style={{ border: "1px solid #adb5bd" }}
                    onClick={() => onPrintTicket(order)}
                  >
                    Stampa Scontrino
                  </Button>
                )}

                {/* Pulsante di avanzamento stato uniforme con variante success */}
                <Button
                  size="sm"
                  variant="success"
                  className="flex-grow-1 fw-bold text-white"
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

      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
        contentClassName="bg-white text-dark shadow-sm"
        style={{ border: "1px solid #ced4da" }}
      >
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fs-5 text-danger fw-bold">
            Conferma Annullamento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          Sei sicuro di voler annullare l'ordine per{" "}
          <strong>
            {isTable ? `il Tavolo ${order.tableNumber}` : "l'Asporto"}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer className="border-top">
          <Button
            variant="outline-secondary"
            onClick={() => setShowCancelModal(false)}
          >
            Chiudi
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Conferma Annullamento
          </Button>
        </Modal.Footer>
      </Modal>

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
