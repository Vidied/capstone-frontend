import React from "react";
import { Button, Card, Form, Table } from "react-bootstrap";
import type { Ingredient } from "../interfaces/Product";
import { ActionButtons } from "./ActionButtons";

interface IngredientsTableProps {
  ingredients: Ingredient[];
  isLoading: boolean;
  onAddNew: () => void;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: number) => void;
  onToggleAvailability: (ingredient: Ingredient) => void;
}

export const IngredientsTable: React.FC<IngredientsTableProps> = ({
  ingredients,
  isLoading,
  onAddNew,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  return (
    <Card
      className="shadow-sm text-dark bg-white"
      style={{ border: "1px solid #ced4da" }}
    >
      <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom py-3">
        <h5 className="mb-0 fw-bold" style={{ color: "#2b2b2b" }}>
          Gestione Scorte Magazzino
        </h5>
        <Button
          variant="success"
          size="sm"
          onClick={onAddNew}
          className="fw-bold"
        >
          + Nuovo Ingrediente
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0 align-middle text-dark">
          <thead>
            <tr
              className="text-muted border-bottom"
              style={{ backgroundColor: "#faf8f5" }}
            >
              <th className="py-3 ps-3">Nome Ingrediente</th>
              <th className="text-center py-3">Stato Scorta</th>
              <th className="text-end py-3 pe-3" style={{ width: "1%" }}>
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing) => (
              <tr key={ing.id} className="border-bottom">
                <td className="fw-bold ps-3" style={{ minWidth: "120px" }}>
                  <span className="text-truncate-2" title={ing.name}>
                    {ing.name}
                  </span>
                </td>

                <td className="text-center">
                  <Form.Check
                    type="switch"
                    id={`ing-switch-${ing.id}`}
                    label={ing.isAvailable ? "In Stock" : "Esaurito"}
                    checked={ing.isAvailable ?? false}
                    onChange={() => onToggleAvailability(ing)}
                  />
                </td>

                <td className="text-end pe-3">
                  <ActionButtons
                    onEdit={() => onEdit(ing)}
                    onDelete={() => onDelete(ing.id)}
                  />
                </td>
              </tr>
            ))}
            {ingredients.length === 0 && !isLoading && (
              <tr>
                <td colSpan={3} className="text-center text-muted py-4">
                  Nessun ingrediente trovato.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
