import { ListGroup } from "react-bootstrap";
import type { OrderItem } from "../interfaces/Order";

interface ItemProps {
  item: OrderItem;
}

export const OrderListItem: React.FC<ItemProps> = ({ item }) => {
  return (
    <ListGroup.Item className="bg-secondary text-white border-dark d-flex justify-content-between align-items-center">
      <div>
        <div>
          <strong>{item.quantity}x</strong> {item.product?.name ?? "Prodotto"}
        </div>
        {item.notes && (
          <small className="text-warning d-flex align-content-start justify-content-start">
            Note: {item.notes}
          </small>
        )}
      </div>
      <span>€ {(item.unitPrice * item.quantity).toFixed(2)}</span>
    </ListGroup.Item>
  );
};
