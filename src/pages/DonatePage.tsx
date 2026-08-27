import type { CSSProperties } from "react";
import Link from "../components/Link";

function DonatePage() {
  return (
    <main style={styles.page}>
      <div className="page-container">
        <header style={styles.header}>
          <Link to="/" style={styles.backLink}>
            ← Назад к объявлениям
          </Link>

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
      '-apple-system, "Helvetica Neue", Arial, sans-serif',
    background: "var(--paper)",
    color: "var(--ink)",
  },

  header: {
    marginBottom: "16px",
  },

  backLink: {
    display: "inline-flex",
    marginBottom: "12px",
    color: "var(--accent)",
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
    color: "var(--ink-soft)",
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
    borderRadius: "14px",
    background: "var(--card)",
    border: "1px solid var(--line)",
    boxShadow: "var(--shadow)",
  },

  icon: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
    borderRadius: "10px",
    background: "color-mix(in srgb, var(--accent) 12%, var(--card))",
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
    color: "var(--ink-soft)",
    fontSize: "14px",
    lineHeight: 1.45,
  },

  disabledButton: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid var(--line)",
    borderRadius: "999px",
    background: "var(--paper)",
    color: "var(--ink-faint)",
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
    background: "var(--accent)",
    color: "var(--accent-ink)",
    fontSize: "13px",
    fontWeight: 900,
    textDecoration: "none",
    boxShadow: "0 6px 14px color-mix(in srgb, var(--accent) 30%, transparent)",
  },
};

export default DonatePage;