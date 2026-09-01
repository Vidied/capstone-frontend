import React, { useEffect, useState } from "react";
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
  const [name, setName] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    if (ingredientToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(ingredientToEdit.name);
      setIsAvailable(ingredientToEdit.isAvailable ?? true);
    } else {
      setName("");
      setIsAvailable(true);
    }
  }, [ingredientToEdit, show]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({ name: name.trim(), isAvailable }, ingredientToEdit?.id);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered data-bs-theme="dark">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title>
          {ingredientToEdit ? "Modifica Ingrediente" : "Nuovo Ingrediente"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-dark text-white">
          <Form.Group className="mb-3">
            <Form.Label>Nome Ingrediente</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="es. Mozzarella di Bufala DOP, Basilico..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary text-white border-0"
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
