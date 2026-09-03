import React from "react";
import { Button, Card, Table } from "react-bootstrap";
import type { Category } from "../interfaces/Product";
import { ActionButtons } from "./ActionButtons";

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  onAddNew: () => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  isLoading,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  return (
    <Card bg="dark" className="border-secondary text-white">
      <Card.Header className="d-flex justify-content-between align-items-center border-secondary">
        <h5 className="mb-0">Gestione Categorie</h5>
        <Button variant="success" size="sm" onClick={onAddNew}>
          + Nuova Categoria
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive variant="dark" hover className="mb-0 align-middle">
          <thead>
            <tr className="border-secondary text-muted">
              <th style={{ width: "100px" }} className="text-center">
                Ordine
              </th>
              <th>Nome Categoria</th>
              <th className="text-end" style={{ width: "1%" }}>
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-secondary">
                <td className="text-center fw-bold">
                  #{cat.displayOrder ?? "-"}
                </td>
                <td className="fw-bold">
                  <span className="text-truncate-2" title={cat.name}>
                    {cat.name}
                  </span>
                </td>
                <td className="text-end">
                  <ActionButtons
                    onEdit={() => onEdit(cat)}
                    onDelete={() => onDelete(cat.id)}
                  />
                </td>
              </tr>
            ))}
            {categories.length === 0 && !isLoading && (
              <tr>
                <td colSpan={3} className="text-center text-muted py-4">
                  Nessuna categoria trovata.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
