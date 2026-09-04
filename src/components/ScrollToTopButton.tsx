import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      variant="light"
      className="position-fixed shadow rounded-circle d-flex align-items-center justify-content-center p-0"
      style={{
        bottom: "30px",
        right: "30px",
        width: "45px",
        height: "45px",
        zIndex: 1050,
        border: "1px solid #ced4da",
        backgroundColor: "#ffffff",
        color: "#2b2b2b",
      }}
      title="Torna su"
    >
      <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>↑</span>
    </Button>
  );
};
