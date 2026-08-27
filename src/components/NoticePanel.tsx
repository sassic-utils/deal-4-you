import type { CSSProperties } from "react";
import PublicationRulesModal from "./PublicationRulesModal";
import { useIsMobile } from "../hooks/useIsMobile";

function NoticePanel() {
  const isMobile = useIsMobile();

  return (
    <section style={styles.panel}>
      <span
        style={{
          ...styles.text,
          ...(isMobile ? styles.textMobile : null),
        }}
      >
        Размещение объявлений:{" "}
        <a
          href="https://t.me/andrei_kuzniatsou"
          target="_blank"
          rel="noreferrer"
          style={styles.link}
        >
          @andrei_kuzniatsou
        </a>
      </span>

      <PublicationRulesModal />
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
    background: "var(--card)",
    border: "1px solid var(--line)",
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

  link: {
    color: "var(--accent)",
    fontWeight: 900,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
};

export default NoticePanel;