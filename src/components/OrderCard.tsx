import { Badge, Card, ListGroup, Button } from "react-bootstrap";
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
}

// Funzione di rendering della singola Card Ordine
export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onNextStatus,
}) => {
  const isTable =
    order.orderType === "TAVOLO" ||
    (order.tableNumber !== null && order.tableNumber !== undefined);

  return (
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

          {order.orderStatus !== "COMPLETED" &&
            order.orderStatus !== "CANCELLED" && (
              <Button
                size="sm"
                variant={
                  order.orderStatus === "READY" ? "success" : "outline-success"
                }
                className="w-100 fw-bold"
                onClick={() => onNextStatus(order.id, order.orderStatus)}
              >
                {getNextStatusLabel(order.orderStatus)}
              </Button>
            )}
        </div>
      </Card.Body>
    </Card>
  );
};
