import type { CSSProperties } from "react";
import PublicationRulesModal from "./PublicationRulesModal";

function NoticePanel() {
  return (
    <section style={styles.panel}>
      <span style={styles.text}>
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
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1e3a8a",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.25,
    boxShadow: "0 6px 14px rgba(37, 99, 235, 0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  text: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  link: {
    color: "#2563eb",
    fontWeight: 900,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
};

export default NoticePanel;