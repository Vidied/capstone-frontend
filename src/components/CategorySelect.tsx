import React from "react";
import { Form } from "react-bootstrap";

interface CategorySelectProps {
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  defaultLabel?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategory,
  categories,
  onCategoryChange,
  defaultLabel = "Tutte le categorie",
}) => {
  return (
    <Form.Select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="bg-white text-dark border shadow-none"
    >
      <option value="TUTTI">{defaultLabel}</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
        </option>
      ))}
    </Form.Select>
  );
};
