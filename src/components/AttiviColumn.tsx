import React from "react";
import { Col, Badge } from "react-bootstrap";
import { OrderCard } from "./OrderCard";
import {
  getBadgeVariant,
  type Order,
  type OrderStatus,
} from "../interfaces/Order";

interface AttiviColumnProps {
  title: string;
  orders: Order[];
  status: OrderStatus;
  emptyMessage: string;
  onNextStatus: (orderId: number, currentStatus: OrderStatus) => void;
  onCancelOrder?: (
    orderId: number,
    tableNumber?: number | string | null,
    orderType?: string,
  ) => void;
}

export const AttiviColumn: React.FC<AttiviColumnProps> = ({
  title,
  orders,
  status,
  emptyMessage,
  onNextStatus,
  onCancelOrder,
}) => {
  return (
    <Col md={4}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0 fw-bold">{title}</h4>
        <Badge bg={getBadgeVariant(status)} text="dark">
          {orders.length}
        </Badge>
      </div>

      {orders.length === 0 ? (
        <p className="text-muted italic">{emptyMessage}</p>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onNextStatus={onNextStatus}
            onCancelOrder={onCancelOrder}
          />
        ))
      )}
    </Col>
  );
};
