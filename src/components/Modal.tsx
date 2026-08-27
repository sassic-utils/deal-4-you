import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  ariaLabelledBy?: string;
  overlayStyle?: CSSProperties;
  modalStyle?: CSSProperties;
  closeButtonStyle?: CSSProperties;
  closeLabel?: string;
};

function Modal({
  onClose,
  children,
  ariaLabelledBy,
  overlayStyle,
  modalStyle,
  closeButtonStyle,
  closeLabel = "Закрыть",
}: ModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      style={{ ...styles.overlay, ...overlayStyle }}
      role="presentation"
      onClick={onClose}
    >
      <div
        style={{ ...styles.modal, ...modalStyle }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          style={{ ...styles.closeButton, ...closeButtonStyle }}
          onClick={onClose}
          aria-label={closeLabel}
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "rgba(10, 14, 11, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },

  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "760px",
    maxHeight: "90vh",
    overflow: "auto",
    background: "var(--card)",
    borderRadius: "22px",
    boxShadow: "0 24px 80px rgba(10, 14, 11, 0.35)",
  },

  closeButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 2,
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    border: "1px solid var(--line)",
    background: "var(--card)",
    color: "var(--ink)",
    fontSize: "24px",
    lineHeight: 1,
    cursor: "pointer",
  },
};

export default Modal;
