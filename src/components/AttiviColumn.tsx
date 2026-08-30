import React from "react";
import { Col } from "react-bootstrap";
import {
  getBadgeVariant,
  type Order,
  type OrderStatus,
} from "../interfaces/Order";
import { OrderCard } from "./OrderCard";

interface AttiviColumnProps {
  status: OrderStatus;
  title: string;
  orders: Order[];
  emptyMessage: string;
  onNextStatus: (orderId: number, currentStatus: OrderStatus) => void;
}

export const AttiviColumn: React.FC<AttiviColumnProps> = ({
  status,
  title,
  orders,
  emptyMessage,
  onNextStatus,
}) => {
  const variant = getBadgeVariant(status);
  return (
    <Col lg={4}>
      <div
        className={`p-2 rounded bg-secondary bg-opacity-10 border border-${variant} mb-3`}
      >
        <h4 className={`text-${variant} fs-5 mb-0`}>
          {title} ({orders.length})
        </h4>
      </div>
      {orders.length === 0 ? (
        <p className="text-muted small">{emptyMessage}</p>
      ) : (
        orders.map((order) => (
          <OrderCard key={order.id} order={order} onNextStatus={onNextStatus} />
        ))
      )}
    </Col>
  );
};
