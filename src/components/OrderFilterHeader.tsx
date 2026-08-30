import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { ALL_ORDER_STATUSES } from "../interfaces/Order";

interface OrderFilterHeaderProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const OrderFilterHeader: React.FC<OrderFilterHeaderProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <Row className="mb-4 align-items-center">
      <Col md={6}>
        <h2>Gestione Comande</h2>
      </Col>
      <Col className="d-flex justify-content-md-end" md={6}>
        <Form.Select
          style={{ maxWidth: "250px" }}
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-dark text-white border-secondary"
        >
          {ALL_ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status === "ATTIVI" ? "Tutti gli Attivi" : status}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  );
};
