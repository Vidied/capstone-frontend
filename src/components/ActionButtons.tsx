import React from "react";
import { Button } from "react-bootstrap";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <div className="d-flex flex-column flex-sm-row justify-content-end gap-1">
      <Button
        variant="outline-info"
        size="sm"
        className="py-0 px-2 fs-7 w-100 w-sm-auto"
        onClick={onEdit}
      >
        Modifica
      </Button>
      <Button
        variant="outline-danger"
        size="sm"
        className="py-0 px-2 fs-7 w-100 w-sm-auto"
        onClick={onDelete}
      >
        Elimina
      </Button>
    </div>
  );
};
