import type { CSSProperties } from "react";

type FiltersProps = {
  search: string;
  city: string;
  category: string;
  cities: string[];
  categories: string[];
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onResetFilters: () => void;
};

function Filters({
                   search,
                   city,
                   category,
                   cities,
                   categories,
                   hasActiveFilters,
                   onSearchChange,
                   onCityChange,
                   onCategoryChange,
                   onResetFilters,
                 }: FiltersProps) {
  return (
    <div className="filters-card" style={styles.filtersCard}>
      <div className="filters-header">
        <h2 style={styles.filtersTitle}>Фильтры</h2>

        {hasActiveFilters && (
          <button
            type="button"
            style={styles.resetButton}
            onClick={onResetFilters}
          >
            Сбросить
          </button>
        )}
      </div>

      <label className="filter-field filter-search" style={styles.field}>
        <span style={styles.label}>Поиск</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Название..."
          style={styles.input}
        />
      </label>

      <div className="filters-row">
        <label className="filter-field" style={styles.field}>
          <span style={styles.label}>Город</span>
          <select
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
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

        <label className="filter-field" style={styles.field}>
          <span style={styles.label}>Категория</span>
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
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
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  filtersCard: {
    background: "var(--card)",
    border: "1px solid var(--line)",
    borderRadius: "14px",
    padding: "12px",
    boxShadow: "var(--shadow)",
  },

  filtersTitle: {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.2,
    letterSpacing: "-0.03em",
    color: "var(--ink)",
  },

  resetButton: {
    border: "none",
    background: "transparent",
    color: "var(--accent)",
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
    color: "var(--ink-faint)",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  input: {
    width: "100%",
    border: "1px solid var(--line)",
    borderRadius: "10px",
    background: "var(--paper)",
    color: "var(--ink)",
    padding: "9px 10px",
    fontSize: "14px",
    outline: "none",
  },
};

export default Filters;