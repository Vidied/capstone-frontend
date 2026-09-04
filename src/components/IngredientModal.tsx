import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import type { Ingredient, IngredientRequestDTO } from "../interfaces/Product";

interface IngredientModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: IngredientRequestDTO, id?: number) => void;
  ingredientToEdit?: Ingredient | null;
}

export const IngredientModal: React.FC<IngredientModalProps> = ({
  show,
  onHide,
  onSubmit,
  ingredientToEdit,
}) => {
  const [name, setName] = useState<string>(ingredientToEdit?.name ?? "");
  const [isAvailable, setIsAvailable] = useState<boolean>(
    ingredientToEdit?.isAvailable ?? true,
  );

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({ name: name.trim(), isAvailable }, ingredientToEdit?.id);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-white border-bottom py-3">
        <Modal.Title className="fw-bold" style={{ color: "#2b2b2b" }}>
          {ingredientToEdit ? "Modifica Ingrediente" : "Nuovo Ingrediente"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-white text-dark py-4">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nome Ingrediente</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="es. Mozzarella di Bufala DOP, Basilico..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </Form.Group>

          <Form.Check
            type="switch"
            id="ingredient-available-switch"
            label="Disponibile in magazzino"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
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
