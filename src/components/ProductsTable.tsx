import React from "react";
import { Badge, Button, Card, Form, Table } from "react-bootstrap";
import type { Product } from "../interfaces/Product";
import { ActionButtons } from "./ActionButtons";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onAddNew: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onToggleAvailability: (product: Product) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  isLoading,
  onAddNew,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  return (
    <Card bg="dark" className="border-secondary text-white">
      <Card.Header className="d-flex justify-content-between align-items-center border-secondary">
        <h5 className="mb-0">Elenco Prodotti</h5>
        <Button variant="success" size="sm" onClick={onAddNew}>
          + Nuovo Prodotto
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive variant="dark" hover className="mb-0 align-middle">
          <thead>
            <tr className="border-secondary text-muted">
              <th>Nome</th>
              <th className="d-none d-md-table-cell">Categoria</th>
              <th>Prezzo</th>
              <th className="d-none d-md-table-cell">Ingredienti</th>
              <th className="text-center">Disponibile</th>
              <th className="text-end" style={{ width: "1%" }}>
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const categoryName =
                product.categoryName ??
                product.category?.name ??
                "Senza Categoria";

              const ingredientsList: string[] = product.ingredientNames
                ? product.ingredientNames
                : product.ingredients
                  ? product.ingredients.map((ing) => ing.name)
                  : [];

              return (
                <tr key={product.id} className="border-secondary">
                  <td className="fw-bold" style={{ minWidth: "120px" }}>
                    <span className="text-truncate-2" title={product.name}>
                      {product.name}
                    </span>
                  </td>

                  <td className="d-none d-md-table-cell">
                    <Badge bg="secondary">{categoryName}</Badge>
                  </td>

                  <td className="text-success fw-bold text-nowrap">
                    € {product.price ? product.price.toFixed(2) : "0.00"}
                  </td>

                  <td className="d-none d-md-table-cell">
                    {ingredientsList.length > 0 ? (
                      <div className="d-flex flex-wrap gap-1">
                        {ingredientsList.map((ingName, index) => (
                          <Badge
                            key={`${product.id}-ing-${index}`}
                            bg="dark"
                            className="border border-secondary"
                          >
                            {ingName}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted small">Nessuno</span>
                    )}
                  </td>

                  <td className="text-center">
                    <Form.Check
                      type="switch"
                      id={`product-switch-${product.id}`}
                      checked={product.isAvailable ?? true}
                      onChange={() => onToggleAvailability(product)}
                    />
                  </td>

                  <td className="text-end">
                    <td className="text-end">
                      <ActionButtons
                        onEdit={() => onEdit(product)}
                        onDelete={() => onDelete(product.id)}
                      />
                    </td>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  Nessun prodotto trovato.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
