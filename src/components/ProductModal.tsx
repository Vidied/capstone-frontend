import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

import type {
  ProductRequestDTO,
  Category,
  Ingredient,
  Product,
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
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string | number>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>(
    [],
  );

  useEffect(() => {
    if (productToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(productToEdit.name);
      setDescription(productToEdit.description || "");
      setPrice(productToEdit.price);
      setIsAvailable(productToEdit.isAvailable ?? true);
      setCategoryId(
        productToEdit.categoryId || productToEdit.category?.id || "",
      );

      const rawRecord = productToEdit as unknown as Record<string, unknown>;

      // 1. Prendi la lista ingredientNames dal DTO o qualsiasi array NON vuoto
      const rawList = rawRecord.ingredientNames ?? rawRecord.ingredients ?? [];

      let targetList: unknown[] = Array.isArray(rawList) ? rawList : [];

      // Fallback: se la chiave specifica è vuota, cerca il primo array con elementi nell'oggetto
      if (targetList.length === 0) {
        const foundNonEmptyArray = Object.values(rawRecord).find(
          (val) => Array.isArray(val) && val.length > 0,
        );
        if (foundNonEmptyArray) {
          targetList = foundNonEmptyArray as unknown[];
        }
      }

      // 2. Mappa i nomi restituiti dal backend con la prop `ingredients` per recuperarne gli ID
      const extractedIds: number[] = targetList
        .map((item: unknown): number | null => {
          // Stringa diretta (es. "Basilico Fresco") dal DTO
          if (typeof item === "string") {
            const nameTrimmed = item.trim().toLowerCase();
            const found = ingredients.find(
              (ing) => ing.name.trim().toLowerCase() === nameTrimmed,
            );
            return found ? found.id : null;
          }

          // Caso ID numerico diretto
          if (typeof item === "number") {
            return item;
          }

          // Oggetto con id o name
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

      setSelectedIngredientIds(extractedIds);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setIsAvailable(true);
      setCategoryId("");
      setSelectedIngredientIds([]);
    }
  }, [productToEdit, show, ingredients]);

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
    <Modal show={show} onHide={onHide} centered data-bs-theme="dark">
      <Modal.Header closeButton className="border-secondary">
        <Modal.Title>
          {productToEdit ? "Modifica Prodotto" : "Nuovo Prodotto"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome Prodotto</Form.Label>
            <Form.Control
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-dark text-white border-secondary"
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Prezzo (€)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Form.Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="bg-dark text-white border-secondary"
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
            <Form.Label>Ingredienti</Form.Label>
            <div className="d-flex flex-wrap gap-2 border border-secondary p-2 rounded">
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
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={onHide}>
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
