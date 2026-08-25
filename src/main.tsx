import { useEffect, useState } from "react";

type Listing = {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  labels: string[];
  url: string;
  createdAt: string;
  updatedAt: string;
};

function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/listings.json`
        );

        if (!response.ok) {
          throw new Error(`Failed to load listings.json: ${response.status}`);
        }

        const data = (await response.json()) as Listing[];
        setListings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Free Board</h1>
        <p style={styles.subtitle}>Доска объявлений работает.</p>
      </header>

      {loading && <p style={styles.message}>Загрузка объявлений...</p>}

      {!loading && error && (
        <p style={{ ...styles.message, ...styles.error }}>
          Ошибка: {error}
        </p>
      )}

      {!loading && !error && listings.length === 0 && (
        <p style={styles.message}>Пока нет объявлений.</p>
      )}

      {!loading && !error && listings.length > 0 && (
        <section style={styles.grid}>
          {listings.map((listing) => (
            <article key={listing.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>{listing.title}</h2>
                <span style={styles.issueNumber}>#{listing.number}</span>
              </div>

              {listing.labels.length > 0 && (
                <div style={styles.labels}>
                  {listing.labels.map((label) => (
                    <span key={label} style={styles.label}>
                      {label}
                    </span>
                  ))}
                </div>
              )}

              {listing.body && (
                <p style={styles.body}>
                  {listing.body.length > 240
                    ? `${listing.body.slice(0, 240)}...`
                    : listing.body}
                </p>
              )}

              <div style={styles.footer}>
                <span>
                  Обновлено:{" "}
                  {new Date(listing.updatedAt).toLocaleDateString("ru-RU")}
                </span>

                <a
                  href={listing.url}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  Открыть
                </a>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    background: "#f5f5f5",
    color: "#111827",
  },
  header: {
    maxWidth: "960px",
    margin: "0 auto 24px",
  },
  title: {
    margin: 0,
    fontSize: "36px",
    lineHeight: 1.1,
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "16px",
  },
  message: {
    maxWidth: "960px",
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
  grid: {
    maxWidth: "960px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "16px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.25,
  },
  issueNumber: {
    color: "#6b7280",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
  labels: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "12px",
  },
  label: {
    padding: "4px 8px",
    borderRadius: "999px",
    background: "#e0f2fe",
    color: "#0369a1",
    fontSize: "12px",
  },
  body: {
    marginTop: "12px",
    color: "#374151",
    whiteSpace: "pre-wrap",
    lineHeight: 1.5,
  },
  footer: {
    marginTop: "16px",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    color: "#6b7280",
    fontSize: "14px",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 700,
  },
};

export default App;