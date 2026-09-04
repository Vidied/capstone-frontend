import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import type {
  Category,
  Ingredient,
  Product,
  ProductRequestDTO,
} from "../interfaces/Product";

interface ProductModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (dto: ProductRequestDTO, id?: number) => void;
  productToEdit?: Product | null;
  categories: Category[];
  ingredients: Ingredient[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  show,
  onHide,
  onSubmit,
  productToEdit,
  categories,
  ingredients,
}) => {
  const [name, setName] = useState<string>(productToEdit?.name ?? "");
  const [description, setDescription] = useState<string>(
    productToEdit?.description ?? "",
  );
  const [price, setPrice] = useState<string | number>(
    productToEdit?.price ?? "",
  );
  const [isAvailable, setIsAvailable] = useState<boolean>(
    productToEdit?.isAvailable ?? true,
  );
  const [categoryId, setCategoryId] = useState<number | string>(
    productToEdit?.categoryId || productToEdit?.category?.id || "",
  );

  // Inizializzazione diretta degli ID degli ingredienti senza useEffect a cascata
  const initialIngredientIds = (() => {
    if (!productToEdit) return [];
    const rawRecord = productToEdit as unknown as Record<string, unknown>;
    const rawList = rawRecord.ingredientNames ?? rawRecord.ingredients ?? [];
    let targetList: unknown[] = Array.isArray(rawList) ? rawList : [];

    if (targetList.length === 0) {
      const foundNonEmptyArray = Object.values(rawRecord).find(
        (val) => Array.isArray(val) && val.length > 0,
      );
      if (foundNonEmptyArray) {
        targetList = foundNonEmptyArray as unknown[];
      }
    }

    return targetList
      .map((item: unknown): number | null => {
        if (typeof item === "string") {
          const nameTrimmed = item.trim().toLowerCase();
          const found = ingredients.find(
            (ing) => ing.name.trim().toLowerCase() === nameTrimmed,
          );
          return found ? found.id : null;
        }
        if (typeof item === "number") return item;
        if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>;
          if (typeof obj.id === "number") return obj.id;
          if (typeof obj.name === "string") {
            const nameTrimmed = obj.name.trim().toLowerCase();
            const found = ingredients.find(
              (ing) => ing.name.trim().toLowerCase() === nameTrimmed,
            );
            return found ? found.id : null;
          }
        }
        return null;
      })
      .filter((id): id is number => id !== null);
  })();

  const [selectedIngredientIds, setSelectedIngredientIds] =
    useState<number[]>(initialIngredientIds);

  const handleIngredientToggle = (id: number) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    const dto: ProductRequestDTO = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price) || 0,
      isAvailable,
      categoryId: Number(categoryId),
      ingredientIds: selectedIngredientIds,
    };

    onSubmit(dto, productToEdit?.id);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-white border-bottom py-3">
        <Modal.Title className="fw-bold" style={{ color: "#2b2b2b" }}>
          {productToEdit ? "Modifica Prodotto" : "Nuovo Prodotto"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-white text-dark py-4">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nome Prodotto</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="es. Pizza Margherita"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Descrivi gli ingredienti o la preparazione..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Prezzo (€)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Categoria</Form.Label>
            <Form.Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Seleziona Categoria...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Ingredienti</Form.Label>
            <div className="d-flex flex-wrap gap-2 border p-3 rounded bg-light">
              {ingredients.map((ing) => (
                <Form.Check
                  key={ing.id}
                  type="checkbox"
                  id={`ing-check-${ing.id}`}
                  label={ing.name}
                  checked={selectedIngredientIds.includes(ing.id)}
                  onChange={() => handleIngredientToggle(ing.id)}
                />
              ))}
              {ingredients.length === 0 && (
                <span className="text-muted small">
                  Nessun ingrediente disponibile.
                </span>
              )}
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="switch"
              id="product-modal-available"
              label="Prodotto Disponibile"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
          </Form.Group>
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
