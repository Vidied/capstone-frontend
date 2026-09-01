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
    <Card bg="dark" className="border-secondary text-white">
      <Card.Header className="d-flex justify-content-between align-items-center border-secondary">
        <h5 className="mb-0">Gestione Scorte Magazzino</h5>
        <Button variant="success" size="sm" onClick={onAddNew}>
          + Nuovo Ingrediente
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive variant="dark" hover className="mb-0 align-middle">
          <thead>
            <tr className="border-secondary text-muted">
              <th>Nome Ingrediente</th>
              <th className="text-center">Stato Scorta</th>
              <th className="text-end" style={{ width: "1%" }}>
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing) => (
              <tr key={ing.id} className="border-secondary">
                <td className="fw-bold" style={{ minWidth: "120px" }}>
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

                <td className="text-end">
                  <td className="text-end">
                    <ActionButtons
                      onEdit={() => onEdit(ing)}
                      onDelete={() => onDelete(ing.id)}
                    />
                  </td>
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
