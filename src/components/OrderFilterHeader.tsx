import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { ALL_ORDER_STATUSES } from "../interfaces/Order";

interface OrderFilterHeaderProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  rightAction?: React.ReactNode;
}

export const OrderFilterHeader: React.FC<OrderFilterHeaderProps> = ({
  selectedStatus,
  onStatusChange,
  rightAction,
}) => {
  return (
    <Row className="mb-4 align-items-center w-100 m-0">
      <Col md={6} className="px-0">
        <h2 className="fw-bold mb-0" style={{ color: "#2b2b2b" }}>
          Gestione Comande
        </h2>
      </Col>
      <Col
        className="d-flex justify-content-md-end align-items-center gap-3 px-0 mt-2 mt-md-0 flex-wrap"
        md={6}
      >
        <Form.Select
          style={{ maxWidth: "250px", border: "1px solid #ced4da" }}
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-white text-dark shadow-sm"
        >
          {ALL_ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status === "ATTIVI" ? "Tutti gli Attivi" : status}
            </option>
          ))}
        </Form.Select>
        {rightAction}
      </Col>
    </Row>
  );
};
