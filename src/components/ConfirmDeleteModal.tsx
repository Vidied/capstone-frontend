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
      contentClassName="bg-white text-dark shadow-sm"
      style={{ border: "1px solid #ced4da" }}
    >
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="fs-5 text-danger fw-bold">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">{message}</Modal.Body>
      <Modal.Footer className="border-top">
        <Button variant="outline-secondary" onClick={onHide}>
          Chiudi
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
