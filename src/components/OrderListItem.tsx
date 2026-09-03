import { ListGroup } from "react-bootstrap";
import type { OrderItem } from "../interfaces/Order";

interface ItemProps {
  item: OrderItem;
}

export const OrderListItem: React.FC<ItemProps> = ({ item }) => {
  return (
    <ListGroup.Item className="bg-secondary text-white border-dark d-flex justify-content-between align-items-center w-100 text-start">
      <div className="d-flex align-items-center me-auto">
        {/* Blocco separato per la quantità */}
        <span
          className="badge bg-dark me-2 d-flex align-items-center justify-content-center"
          style={{ minWidth: "32px", height: "32px", fontSize: "0.85rem" }}
        >
          {item.quantity}x
        </span>

        <div>
          <div className="fw-semibold">{item.productName ?? "Prodotto"}</div>
          {item.notes && (
            <small className="text-warning d-block">Note: {item.notes}</small>
          )}
        </div>
      </div>
      <span className="fw-bold text-nowrap ms-2">
        € {((item.price ?? 0) * item.quantity).toFixed(2)}
      </span>
    </ListGroup.Item>
  );
};
