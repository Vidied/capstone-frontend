import { Form, InputGroup } from "react-bootstrap";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Cerca...",
}: SearchBarProps) => {
  return (
    <InputGroup>
      <Form.Control
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-dark text-white border-secondary"
      />
    </InputGroup>
  );
};
