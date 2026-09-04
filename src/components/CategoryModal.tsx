import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import type { Category, CategoryRequestDTO } from "../interfaces/Product";

interface CategoryModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: CategoryRequestDTO, id?: number) => void;
  categoryToEdit?: Category | null;
  categories: Category[];
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  show,
  onHide,
  onSubmit,
  categoryToEdit,
  categories,
}) => {
  const [name, setName] = useState<string>(categoryToEdit?.name ?? "");
  const [displayOrder, setDisplayOrder] = useState<string>(
    categoryToEdit?.displayOrder !== undefined &&
      categoryToEdit?.displayOrder !== null
      ? String(categoryToEdit.displayOrder)
      : "",
  );

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const dto: CategoryRequestDTO = {
      name: name.trim(),
      displayOrder: displayOrder !== "" ? Number(displayOrder) : undefined,
    };

    onSubmit(dto, categoryToEdit?.id);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-white border-bottom py-3">
        <Modal.Title className="fw-bold" style={{ color: "#2b2b2b" }}>
          {categoryToEdit ? "Modifica Categoria" : "Nuova Categoria"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-white text-dark py-4">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nome Categoria</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="es. Pizze Speciali, Bevande..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </Form.Group>

          {categoryToEdit && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Scambia Posizione Con</Form.Label>
              <Form.Select
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              >
                <option value="">
                  Nessuno scambio (mantieni posizione corrente #
                  {categoryToEdit.displayOrder})
                </option>

                {categories
                  .filter(
                    (cat) =>
                      cat.id !== categoryToEdit.id &&
                      cat.displayOrder !== undefined,
                  )
                  .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                  .map((cat) => (
                    <option key={cat.id} value={cat.displayOrder}>
                      Posizione #{cat.displayOrder} - ({cat.name})
                    </option>
                  ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Seleziona la categoria con cui vuoi scambiare l'ordine di
                visualizzazione
              </Form.Text>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-white border-top">
          <Button variant="outline-secondary" onClick={onHide}>
            Annulla
          </Button>
          <Button variant="success" type="submit" className="fw-bold">
            Salva
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
