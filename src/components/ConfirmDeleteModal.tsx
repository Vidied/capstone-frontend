import React from "react";
import { Button, Modal } from "react-bootstrap";

interface ConfirmDeleteModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmButtonText?: string;
  onHide: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  show,
  title,
  message,
  confirmButtonText = "Elimina",
  onHide,
  onConfirm,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="bg-dark text-white border-secondary"
    >
      <Modal.Header
        closeButton
        closeVariant="white"
        className="border-secondary"
      >
        <Modal.Title className="fs-5 text-danger">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer className="border-secondary">
        <Button variant="secondary" onClick={onHide}>
          Chiudi
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
