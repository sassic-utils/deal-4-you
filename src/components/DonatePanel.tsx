import type { CSSProperties } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

function DonatePanel() {
  const isMobile = useIsMobile();

  return (
    <section style={styles.panel}>
      <span
        style={{
          ...styles.text,
          ...(isMobile ? styles.textMobile : null),
        }}
      >
        Если сайт полезен — поддержите проект ❤️
      </span>

      <a href="#/donate" style={styles.button}>
        Поддержать
      </a>
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  panel: {
    width: "100%",
    minHeight: "33px",
    marginBottom: "10px",
    padding: "7px 9px 7px 11px",
    borderRadius: "12px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    color: "#7c2d12",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.25,
    boxShadow: "0 6px 14px rgba(234, 88, 12, 0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    minWidth: 0,
  },

  text: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  textMobile: {
    whiteSpace: "normal",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
  },

  button: {
    flexShrink: 0,
    minHeight: "24px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px 10px",
    borderRadius: "999px",
    border: "none",
    background: "#ea580c",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 900,
    lineHeight: 1.2,
    textDecoration: "none",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 10px rgba(234, 88, 12, 0.18)",
  },
};

export default DonatePanel;