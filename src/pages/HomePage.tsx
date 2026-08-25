import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import ListingsGrid from "../components/ListingsGrid";
import StatusMessage from "../components/StatusMessage";
import type { Listing } from "../models/listing";
import { fetchListings, parseListings } from "../services/listingsService";

function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
        const data = await fetchListings();
        setListings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  const parsedListings = useMemo(() => parseListings(listings), [listings]);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Free Board</h1>
          <p style={styles.subtitle}>Доска объявлений работает.</p>
        </div>

        <div style={styles.counter}>{parsedListings.length} объявл.</div>
      </header>

      {loading && <StatusMessage>Загрузка объявлений...</StatusMessage>}

      {!loading && error && (
        <StatusMessage variant="error">Ошибка: {error}</StatusMessage>
      )}

      {!loading && !error && parsedListings.length === 0 && (
        <StatusMessage>Пока нет объявлений.</StatusMessage>
      )}

      {!loading && !error && parsedListings.length > 0 && (
        <ListingsGrid listings={parsedListings} />
      )}
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "48px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: "#f3f4f6",
    color: "#111827",
  },
  header: {
    maxWidth: "1440px",
    margin: "0 auto 36px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "24px",
  },
  title: {
    margin: 0,
    fontSize: "56px",
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },
  subtitle: {
    margin: "18px 0 0",
    color: "#6b7280",
    fontSize: "24px",
    fontWeight: 500,
  },
  counter: {
    padding: "10px 16px",
    borderRadius: "999px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
    fontWeight: 700,
  },
};

export default HomePage;