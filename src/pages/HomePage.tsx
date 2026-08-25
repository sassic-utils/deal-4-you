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

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

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

  const cities = useMemo(() => {
    return Array.from(
      new Set(parsedListings.map((listing) => listing.city).filter(Boolean))
    ).sort();
  }, [parsedListings]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(parsedListings.map((listing) => listing.category).filter(Boolean))
    ).sort();
  }, [parsedListings]);

  const filteredListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return parsedListings.filter((listing) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          listing.title,
          listing.description,
          listing.city,
          listing.category,
          listing.price,
          listing.contact,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCity = !city || listing.city === city;
      const matchesCategory = !category || listing.category === category;

      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [parsedListings, search, city, category]);

  const hasActiveFilters = Boolean(search || city || category);

  function resetFilters() {
    setSearch("");
    setCity("");
    setCategory("");
  }

  return (
    <main style={styles.page}>
      <header className="page-header">
        <div style={styles.headerText}>
          <h1 style={styles.title}>Free Board</h1>
          <p style={styles.subtitle}>Доска объявлений работает.</p>
        </div>

        <div style={styles.counter}>
          {filteredListings.length} из {parsedListings.length} объявл.
        </div>
      </header>

      {loading && <StatusMessage>Загрузка объявлений...</StatusMessage>}

      {!loading && error && (
        <StatusMessage variant="error">Ошибка: {error}</StatusMessage>
      )}

      {!loading && !error && (
        <div className="page-layout">
          <aside className="filters-sidebar">
            <div className="filters-card" style={styles.filtersCard}>
              <div style={styles.filtersHeader}>
                <h2 style={styles.filtersTitle}>Фильтры</h2>

                {hasActiveFilters && (
                  <button
                    type="button"
                    style={styles.resetButton}
                    onClick={resetFilters}
                  >
                    Сбросить
                  </button>
                )}
              </div>

              <label style={styles.field}>
                <span style={styles.label}>Поиск</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Название, описание..."
                  style={styles.input}
                />
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Город</span>
                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  style={styles.input}
                >
                  <option value="">Все города</option>
                  {cities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Категория</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  style={styles.input}
                >
                  <option value="">Все категории</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </aside>

          <section className="results-area">
            {filteredListings.length === 0 ? (
              <StatusMessage>По фильтрам ничего не найдено.</StatusMessage>
            ) : (
              <ListingsGrid listings={filteredListings} />
            )}
          </section>
        </div>
      )}
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

  headerText: {
    minWidth: 0,
  },

  title: {
    margin: 0,
    fontSize: "30px",
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: 500,
  },

  counter: {
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  filtersCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "12px",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
  },

  filtersHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "10px",
  },

  filtersTitle: {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.2,
    letterSpacing: "-0.03em",
  },

  resetButton: {
    border: "none",
    background: "transparent",
    color: "#0369a1",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
    padding: 0,
  },

  field: {
    display: "block",
    marginTop: "10px",
  },

  label: {
    display: "block",
    marginBottom: "4px",
    color: "#6b7280",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  input: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#111827",
    padding: "9px 10px",
    fontSize: "14px",
    outline: "none",
  },
};

export default HomePage;