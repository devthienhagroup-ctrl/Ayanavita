// src/components/ui/Modal.tsx
import React, { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
};

export function Modal({ open, onClose, children, ariaLabel }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={`modal ${open ? "active" : ""}`}
      aria-hidden={!open}
      aria-label={ariaLabel || "Modal"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
