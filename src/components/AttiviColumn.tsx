import React from "react";
import { Col } from "react-bootstrap";
import type { Order, OrderStatus } from "../interfaces/Order";
import { OrderCard } from "./OrderCard";

interface AttiviColumnProps {
  title: string;
  orders: Order[];
  status: OrderStatus;
  emptyMessage: string;
  onNextStatus: (orderId: number, currentStatus: OrderStatus) => void;
  onCancelOrder: (
    orderId: number,
    tableNumber?: number | string | null,
    orderType?: string,
  ) => void;
  onPrintTicket?: (order: Order) => void;
  onDeleteSingleOrder?: (orderId: number) => void;
}

export const AttiviColumn: React.FC<AttiviColumnProps> = ({
  title,
  orders,
  emptyMessage,
  onNextStatus,
  onCancelOrder,
  onPrintTicket,
  onDeleteSingleOrder,
}) => {
  return (
    <Col md={4}>
      <div className="p-2 rounded bg-dark border border-secondary min-vh-100">
        <h5 className="text-center text-light mb-3">{title}</h5>
        {orders.length === 0 ? (
          <p className="text-muted text-center small">{emptyMessage}</p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onNextStatus={onNextStatus}
              onCancelOrder={onCancelOrder}
              onPrintTicket={onPrintTicket}
              onDeleteSingleOrder={onDeleteSingleOrder}
            />
          ))
        )}
      </div>
    </Col>
  );
};
