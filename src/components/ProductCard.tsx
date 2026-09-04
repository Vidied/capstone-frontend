import { useState } from "react";
import { Col, Modal } from "react-bootstrap";
import type { Product } from "../interfaces/Product";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const hasIngredients =
    product.ingredientNames && product.ingredientNames.length > 0;
  const hasDescription =
    product.description && product.description.trim() !== "";

  const ingredientsText = product.ingredientNames?.join(", ");

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Col xs={12}>
        <div
          className="product-card-clean py-3"
          style={{ cursor: "pointer" }}
          onClick={handleOpenModal}
        >
          <div className="d-flex justify-content-between align-items-baseline mb-1">
            <h5
              className="product-title h5 mb-0"
              style={{ fontWeight: 800, color: "#1a1a1a", fontSize: "1.15rem" }}
            >
              {product.name}
            </h5>
            <span className="product-price fs-5 ms-3">
              € {product.price.toFixed(2)}
            </span>
          </div>

          {hasDescription && (
            <p className="small text-muted mb-1 fst-italic">
              {product.description}
            </p>
          )}

          {hasIngredients && (
            <div className="mt-1 text-start">
              <p
                className="text-secondary mb-0 text-start"
                style={{
                  fontSize: "0.825rem",
                  lineHeight: "1.3",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <strong className="fw-semibold text-dark">Ingredienti: </strong>
                {ingredientsText}
              </p>
            </div>
          )}
        </div>
      </Col>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        contentClassName="border-0 shadow-lg"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div style={{ backgroundColor: "#fcfaf7", borderRadius: "8px" }}>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title
              className="product-title h3"
              style={{ fontWeight: 800, color: "#1a1a1a" }}
            >
              {product.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-2 pb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small uppercase">Prezzo</span>
              <span className="product-price fs-4">
                € {product.price.toFixed(2)}
              </span>
            </div>

            {hasDescription && (
              <div className="mb-3 text-start">
                <h6 className="fw-bold text-dark small text-uppercase mb-1">
                  Descrizione
                </h6>
                <p className="text-secondary fst-italic">
                  {product.description}
                </p>
              </div>
            )}

            {hasIngredients && (
              <div className="text-start">
                <h6 className="fw-bold text-dark small text-uppercase mb-1">
                  Ingredienti
                </h6>
                <p
                  className="text-secondary fs-6 mb-0 text-start"
                  style={{ lineHeight: "1.4" }}
                >
                  {ingredientsText}
                </p>
              </div>
            )}
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};
