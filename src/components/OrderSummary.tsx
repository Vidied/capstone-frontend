import React from "react";
import { Card, Button, Form, InputGroup, ListGroup } from "react-bootstrap";
import type { OrderSummaryProps } from "../interfaces/Order";

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  tableNumber,
  coverCount,
  orderType,
  generalNotes,
  onTableNumberChange,
  onCoverCountChange,
  onOrderTypeChange,
  onGeneralNotesChange,
  onUpdateQuantity,
  onUpdateNotes,
  onRemoveItem,
  onSubmitOrder,
  isSubmitting,
}) => {
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <Card
      className="bg-dark text-white border-secondary sticky-top"
      style={{ top: "1rem" }}
    >
      <Card.Header className="border-secondary bg-dark text-white fw-bold h5 py-3">
        Riepilogo Comanda
      </Card.Header>

      <Card.Body>
        {/* 1. Selezione Tipo Comanda */}
        <Form className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label className="small text-muted fw-semibold">
              Tipo Comanda
            </Form.Label>
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant={
                  orderType === "TAVOLO" ? "primary" : "outline-secondary"
                }
                className="w-50"
                onClick={() => onOrderTypeChange("TAVOLO")}
              >
                Tavolo
              </Button>
              <Button
                size="sm"
                variant={
                  orderType === "ASPORTO" ? "primary" : "outline-secondary"
                }
                className="w-50"
                onClick={() => onOrderTypeChange("ASPORTO")}
              >
                Asporto
              </Button>
            </div>
          </Form.Group>

          {/* 2. Dettagli Tavolo e Coperti */}
          {orderType === "TAVOLO" && (
            <div className="row g-2 mb-3">
              <div className="col-6">
                <Form.Label className="small text-muted fw-semibold">
                  N. Tavolo
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Es. 5"
                  value={tableNumber}
                  onChange={(e) => onTableNumberChange(e.target.value)}
                  className="bg-dark text-white border-secondary"
                />
              </div>
              <div className="col-6">
                <Form.Label className="small text-muted fw-semibold">
                  Coperti
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Es. 4"
                  value={coverCount}
                  onChange={(e) => onCoverCountChange(e.target.value)}
                  className="bg-dark text-white border-secondary"
                />
              </div>
            </div>
          )}

          {/* 3. Note generali */}
          <Form.Group className="mb-2">
            <Form.Label className="small text-muted fw-semibold">
              Note Ordine (Opzionali)
            </Form.Label>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Es. Servire prima i piatti dei bambini"
              value={generalNotes}
              onChange={(e) => onGeneralNotesChange(e.target.value)}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        </Form>

        <hr className="border-secondary" />

        {/* 4. Lista dei piatti nel Carrello */}
        {cart.length === 0 ? (
          <p className="text-muted text-center py-4 my-0">
            Nessun piatto inserito in comanda.
          </p>
        ) : (
          <ListGroup variant="flush" className="mb-3">
            {cart.map(({ product, quantity, notes }, index) => (
              <ListGroup.Item
                key={`${product.id}-${index}`}
                className="bg-dark text-white border-secondary px-0 py-2"
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span className="fw-bold me-2">{product.name}</span>
                  <span className="text-success fw-bold">
                    € {(product.price * quantity).toFixed(2)}
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <InputGroup size="sm" style={{ width: "110px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        onUpdateQuantity(index, Math.max(1, quantity - 1))
                      }
                    >
                      -
                    </Button>
                    <Form.Control
                      readOnly
                      value={quantity}
                      className="bg-dark text-white border-secondary text-center px-1"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => onUpdateQuantity(index, quantity + 1)}
                    >
                      +
                    </Button>
                  </InputGroup>

                  <Button
                    variant="link"
                    className="text-danger p-0 text-decoration-none small"
                    onClick={() => onRemoveItem(index)}
                  >
                    Rimuovi
                  </Button>
                </div>

                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Note piatto (es. ben cotta, senza origano)"
                  value={notes || ""}
                  onChange={(e) => onUpdateNotes(index, e.target.value)}
                  className="bg-dark text-white border-secondary small"
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <hr className="border-secondary" />

        {/* 5. Totale e Pulsante Invio */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="h5 mb-0">Totale:</span>
          <span className="h4 mb-0 text-success fw-bold">
            € {totalAmount.toFixed(2)}
          </span>
        </div>

        <Button
          variant="success"
          size="lg"
          className="w-100 fw-bold"
          disabled={cart.length === 0 || isSubmitting}
          onClick={onSubmitOrder}
        >
          {isSubmitting ? "Invio in corso..." : "Invia Comanda"}
        </Button>
      </Card.Body>
    </Card>
  );
};
