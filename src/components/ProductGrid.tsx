import React from "react";
import { Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import type { Product } from "../features/menu/productSlice";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  error,
  onAddToCart,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        Nessun prodotto trovato.
      </div>
    );
  }

  return (
    <Row className="row-cols-1 row-cols-md-2 g-3">
      {products.map((product) => (
        <Col key={product.id}>
          <Card className="h-100 bg-dark text-white border-secondary">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div>
                <Card.Title className="h6">{product.name}</Card.Title>
                {/* <Card.Text>{product.ingredientNames}</Card.Text>  da decidere ancora se far mostrare o no la lista ingredienti dal lato delle comande, onestamente non mi sembra necessario  */}
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="fw-bold text-success">
                  € {product.price.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onAddToCart(product)}
                >
                  + Aggiungi
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
