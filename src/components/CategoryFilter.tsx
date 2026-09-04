import { useRef } from "react";
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
  const navRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (navRef.current && e.deltaY !== 0) {
      navRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div
      ref={navRef}
      onWheel={handleWheel}
      className="overflow-auto no-scrollbar category-scroll-container py-1"
    >
      <Nav
        variant="pills"
        activeKey={selectedCategoryId ? String(selectedCategoryId) : ""}
        onSelect={(selectedKey) => {
          const id = Number(selectedKey);
          onSelectCategory(selectedCategoryId === id ? null : id);
        }}
        className="custom-category-pills flex-nowrap px-3"
      >
        {categories.map((cat) => (
          <Nav.Item key={cat.id}>
            <Nav.Link
              eventKey={String(cat.id)}
              className="px-3 py-1.5 me-1 fw-semibold small shadow-sm"
            >
              {cat.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};
