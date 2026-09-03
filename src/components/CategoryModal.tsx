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
    <Modal show={show} onHide={onHide} centered data-bs-theme="dark">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title>
          {categoryToEdit ? "Modifica Categoria" : "Nuova Categoria"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-dark text-white">
          <Form.Group className="mb-3">
            <Form.Label>Nome Categoria</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="es. Pizze Speciali, Bevande..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary text-white border-0"
              autoFocus
            />
          </Form.Group>

          {categoryToEdit && (
            <Form.Group className="mb-3">
              <Form.Label>Scambia Posizione Con</Form.Label>
              <Form.Select
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="bg-secondary text-white border-0"
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
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="outline-secondary" onClick={onHide}>
            Annulla
          </Button>
          <Button variant="success" type="submit">
            Salva
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
