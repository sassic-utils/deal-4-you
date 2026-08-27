import type { CSSProperties } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import Link from "./Link";

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

      <Link to="/donate" style={styles.button}>
        Поддержать
      </Link>
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
    background: "color-mix(in srgb, var(--accent) 10%, var(--card))",
    border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--line))",
    color: "var(--ink)",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.25,
    boxShadow: "var(--shadow)",
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
    background: "var(--accent)",
    color: "var(--accent-ink)",
    fontSize: "12px",
    fontWeight: 900,
    lineHeight: 1.2,
    textDecoration: "none",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 10px color-mix(in srgb, var(--accent) 35%, transparent)",
  },
};

export default DonatePanel;