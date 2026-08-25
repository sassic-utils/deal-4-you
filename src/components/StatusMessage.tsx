import type { CSSProperties, ReactNode } from "react";

type StatusMessageProps = {
  children: ReactNode;
  variant?: "default" | "error";
};

function StatusMessage({ children, variant = "default" }: StatusMessageProps) {
  return (
    <p
      style={{
        ...styles.message,
        ...(variant === "error" ? styles.error : {}),
      }}
    >
      {children}
    </p>
  );
}

const styles: Record<string, CSSProperties> = {
  message: {
    maxWidth: "1440px",
    margin: "24px auto",
    padding: "16px",
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  error: {
    color: "#b91c1c",
    borderColor: "#fecaca",
    background: "#fef2f2",
  },
};

export default StatusMessage;