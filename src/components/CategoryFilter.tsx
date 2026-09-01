import { Nav } from "react-bootstrap";
import type { Category } from "../interfaces/Product";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <Nav
      variant="pills"
      activeKey={
        selectedCategoryId === null ? "all" : String(selectedCategoryId)
      }
      onSelect={(selectedKey) => {
        if (selectedKey === "all" || !selectedKey) {
          onSelectCategory(null);
        } else {
          onSelectCategory(Number(selectedKey));
        }
      }}
      className="flex-nowrap overflow-auto pb-2"
    >
      <Nav.Item>
        <Nav.Link eventKey="all" className="px-3 fw-semibold">
          Tutti i Piatti
        </Nav.Link>
      </Nav.Item>
      {categories.map((cat) => (
        <Nav.Item key={cat.id}>
          <Nav.Link eventKey={String(cat.id)} className="px-3 fw-semibold">
            {cat.name}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};
