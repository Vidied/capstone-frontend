import React, { useState } from "react";
import { Badge, Card, ListGroup, Button, Modal } from "react-bootstrap";
import { OrderListItem } from "./OrderListItem";
import {
  getBadgeVariant,
  getNextStatusLabel,
  type Order,
  type OrderStatus,
} from "../interfaces/Order";

interface OrderCardProps {
  order: Order;
  onNextStatus: (orderId: number, currentStatus: OrderStatus) => void;
  onCancelOrder?: (
    orderId: number,
    tableNumber?: number | string | null,
    orderType?: string,
  ) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onNextStatus,
  onCancelOrder,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isTable =
    order.orderType === "TAVOLO" ||
    (order.tableNumber !== null && order.tableNumber !== undefined);

  const handleConfirmCancel = () => {
    if (onCancelOrder) {
      onCancelOrder(order.id, order.tableNumber, order.orderType);
    }
    setShowCancelModal(false);
  };

  return (
    <>
      <Card
        key={order.id}
        className="bg-dark text-white border-secondary mb-3 shadow-sm"
      >
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
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {isTable && order.coverCount && (
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
              Totale: € {order.totalAmount.toFixed(2)}
            </div>

            {/* Barra azioni affiancate */}
            {order.orderStatus !== "COMPLETED" && (
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant={
                    order.orderStatus === "READY"
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

      {/* Modal di conferma cancellazione */}
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
          </strong>{" "}
          (Ordine #{order.id})?
          <br />
          <small className="text-muted">
            Verrà inviato il biglietto di cancellazione alla stampante.
          </small>
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
    </>
  );
};
