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
    <Card
      className="shadow-sm text-dark bg-white"
      style={{ border: "1px solid #ced4da" }}
    >
      <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom py-3">
        <h5 className="mb-0 fw-bold" style={{ color: "#2b2b2b" }}>
          Elenco Prodotti
        </h5>
        <Button
          variant="success"
          size="sm"
          onClick={onAddNew}
          className="fw-bold"
        >
          + Nuovo Prodotto
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0 align-middle text-dark">
          <thead>
            <tr
              className="text-muted border-bottom"
              style={{ backgroundColor: "#faf8f5" }}
            >
              <th className="py-3 ps-3">Nome</th>
              <th className="d-none d-md-table-cell py-3">Categoria</th>
              <th className="py-3">Prezzo</th>
              <th className="d-none d-md-table-cell py-3">Ingredienti</th>
              <th className="text-center py-3">Disponibile</th>
              <th className="text-end py-3 pe-3" style={{ width: "1%" }}>
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
              const hasUnavailableIngredient =
                !product.isAvailable &&
                product.ingredients?.some((ing) => !ing.isAvailable);

              return (
                <tr key={product.id} className="border-bottom">
                  <td className="fw-bold ps-3" style={{ minWidth: "120px" }}>
                    <span className="text-truncate-2" title={product.name}>
                      {product.name}
                    </span>
                  </td>

                  <td className="d-none d-md-table-cell">
                    <Badge bg="light" text="dark" className="border">
                      {categoryName}
                    </Badge>
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
                            bg="light"
                            text="dark"
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
                      checked={product.isAvailable}
                      disabled={hasUnavailableIngredient}
                      title={
                        hasUnavailableIngredient
                          ? "Impossibile attivare: alcuni ingredienti non sono disponibili"
                          : "Cambia disponibilità"
                      }
                      onChange={() => onToggleAvailability(product)}
                    />
                  </td>

                  <td className="text-end pe-3">
                    <ActionButtons
                      onEdit={() => onEdit(product)}
                      onDelete={() => onDelete(product.id)}
                    />
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
