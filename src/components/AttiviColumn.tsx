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
      <div
        className="p-3 rounded bg-white border shadow-sm min-vh-100"
        style={{ borderColor: "#ced4da" }}
      >
        <h5
          className="text-center fw-bold mb-3 pb-2 border-bottom"
          style={{ color: "#2b2b2b" }}
        >
          {title}
        </h5>
        {orders.length === 0 ? (
          <p className="text-muted text-center small py-4">{emptyMessage}</p>
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
