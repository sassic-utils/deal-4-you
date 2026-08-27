import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "../components/Link";

const JOKES = [
  "Это объявление, видимо, уже продано. Вместе со страницей.",
  "404 — единственная категория, которую забыли добавить в фильтры.",
  "Здесь могла быть ваша реклама. Но её нет. Как и страницы.",
  "Владелец проверил это объявление и решил не публиковать страницу вообще.",
  "Похоже, эту страницу забрали на запчасти.",
];

function NotFoundPage() {
  const [joke] = useState(() => JOKES[Math.floor(Math.random() * JOKES.length)]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Страница потерялась — Free Board";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.emoji}>🕵️‍♂️📦</div>
        <h1 style={styles.title}>404. Объявление не найдено.</h1>
        <p style={styles.text}>{joke}</p>
        <Link to="/" style={styles.link}>
          ← Вернуться на доску объявлений
        </Link>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily:
      '-apple-system, "Helvetica Neue", Arial, sans-serif',
    background: "var(--paper)",
    color: "var(--ink)",
  },

  card: {
    maxWidth: "440px",
    width: "100%",
    textAlign: "center",
    padding: "32px 24px",
    borderRadius: "14px",
    background: "var(--card)",
    border: "1px solid var(--line)",
    boxShadow: "var(--shadow)",
  },

  emoji: {
    fontSize: "44px",
    lineHeight: 1,
    marginBottom: "12px",
  },

  title: {
    margin: 0,
    fontSize: "22px",
    lineHeight: 1.2,
    letterSpacing: "-0.03em",
  },

  text: {
    margin: "12px 0 20px",
    color: "var(--ink-soft)",
    fontSize: "15px",
    lineHeight: 1.5,
  },

  link: {
    display: "inline-flex",
    color: "var(--accent)",
    fontSize: "14px",
    fontWeight: 800,
    textDecoration: "none",
  },
};

export default NotFoundPage;
