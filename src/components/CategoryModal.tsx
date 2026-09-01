import React, { useEffect, useState } from "react";
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
  const [name, setName] = useState<string>("");
  const [displayOrder, setDisplayOrder] = useState<string>("");

  useEffect(() => {
    if (categoryToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(categoryToEdit.name);
      setDisplayOrder(
        categoryToEdit.displayOrder !== undefined &&
          categoryToEdit.displayOrder !== null
          ? String(categoryToEdit.displayOrder)
          : "",
      );
    } else {
      setName("");
      setDisplayOrder("");
    }
  }, [categoryToEdit, show]);

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
              <Form.Label>Ordine di Visualizzazione</Form.Label>
              <Form.Select
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="bg-secondary text-white border-0"
              >
                <option value="" disabled>
                  Seleziona una posizione...
                </option>

                {categories
                  .map((cat) => cat.displayOrder)
                  .filter(
                    (order): order is number =>
                      order !== undefined && order !== null,
                  )
                  .sort((a, b) => a - b)
                  .map((order) => {
                    const currentCat = categories.find(
                      (c) => c.displayOrder === order,
                    );
                    return (
                      <option key={order} value={order}>
                        #{order} {currentCat ? `(${currentCat.name})` : ""}
                      </option>
                    );
                  })}
              </Form.Select>
              <Form.Text className="text-muted">
                Seleziona la categoria con cui vuoi scambiare la posizione
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
