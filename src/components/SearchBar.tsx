import { Form, InputGroup } from "react-bootstrap";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Cerca piatto o ingrediente...",
}: SearchBarProps) => {
  return (
    <InputGroup className="shadow-sm rounded-pill overflow-hidden bg-white border border-dark">
      <InputGroup.Text className="bg-white border-0 pe-1 text-dark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </InputGroup.Text>
      <Form.Control
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border-0 shadow-none text-dark bg-white"
        style={{ fontSize: "0.95rem" }}
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="btn btn-link text-dark border-0 p-2 me-1 shadow-none"
          title="Cancella ricerca"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
          </svg>
        </button>
      )}
    </InputGroup>
  );
};
