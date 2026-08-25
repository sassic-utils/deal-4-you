import type { CSSProperties } from "react";

function DonatePage() {
  return (
    <main style={styles.page}>
      <div className="page-container">
        <header style={styles.header}>
          <a href="#/" style={styles.backLink}>
            ← Назад к объявлениям
          </a>

          <h1 style={styles.title}>Поддержать проект</h1>

          <p style={styles.subtitle}>
            Здесь будут варианты доната. Пока это заглушки — позже можно
            добавить реальные ссылки и реквизиты.
          </p>
        </header>

        <section style={styles.grid}>
          <article style={styles.card}>
            <div style={styles.icon}>💳</div>
            <h2 style={styles.cardTitle}>Банковская карта</h2>
            <p style={styles.cardText}>
              Здесь будет ссылка или реквизиты для перевода на карту.
            </p>
            <button type="button" disabled style={styles.disabledButton}>
              Скоро
            </button>
          </article>

          <article style={styles.card}>
            <div style={styles.icon}>☕</div>
            <h2 style={styles.cardTitle}>Buy Me a Coffee</h2>
            <p style={styles.cardText}>
              Здесь будет ссылка на страницу поддержки проекта.
            </p>
            <button type="button" disabled style={styles.disabledButton}>
              Скоро
            </button>
          </article>

          <article style={styles.card}>
            <div style={styles.icon}>₿</div>
            <h2 style={styles.cardTitle}>Crypto</h2>
            <p style={styles.cardText}>
              Здесь будут адреса кошельков для криптовалютного доната.
            </p>
            <button type="button" disabled style={styles.disabledButton}>
              Скоро
            </button>
          </article>

          <article style={styles.card}>
            <div style={styles.icon}>💬</div>
            <h2 style={styles.cardTitle}>Через Telegram</h2>
            <p style={styles.cardText}>
              Можно написать в Telegram и уточнить удобный способ поддержки.
            </p>
            <a
              href="https://t.me/andrei_kuzniatsou"
              target="_blank"
              rel="noreferrer"
              style={styles.primaryButton}
            >
              Написать в Telegram
            </a>
          </article>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "14px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: "#f3f4f6",
    color: "#111827",
  },

  header: {
    marginBottom: "16px",
  },

  backLink: {
    display: "inline-flex",
    marginBottom: "12px",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: 800,
    textDecoration: "none",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
  },

  subtitle: {
    maxWidth: "680px",
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: 1.5,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
  },

  card: {
    padding: "16px",
    borderRadius: "18px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  },

  icon: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
    borderRadius: "14px",
    background: "#fff7ed",
    fontSize: "24px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "18px",
    lineHeight: 1.2,
    letterSpacing: "-0.03em",
  },

  cardText: {
    minHeight: "48px",
    margin: "8px 0 14px",
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: 1.45,
  },

  disabledButton: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "999px",
    background: "#f3f4f6",
    color: "#9ca3af",
    fontSize: "13px",
    fontWeight: 900,
    cursor: "not-allowed",
  },

  primaryButton: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "9px 12px",
    borderRadius: "999px",
    background: "#ea580c",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 900,
    textDecoration: "none",
    boxShadow: "0 6px 14px rgba(234, 88, 12, 0.22)",
  },
};

export default DonatePage;