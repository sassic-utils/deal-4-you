import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import ListingsGrid from "../components/ListingsGrid";
import StatusMessage from "../components/StatusMessage";
import ListingLightbox from "../components/ListingLightbox";
import type { Listing } from "../models/listing";
import { fetchListings, parseListings } from "../services/listingsService";
import NoticePanel from "../components/NoticePanel";
import DonatePanel from "../components/DonatePanel";
import Filters from "../components/Filters";
import { usePathname } from "../hooks/usePathname";
import { navigate } from "../router";

const LISTING_PATH_PATTERN = /^\/listing\/(\d+)$/;

function getActiveListingNumber(pathname: string) {
  const match = pathname.match(LISTING_PATH_PATTERN);
  return match ? Number(match[1]) : null;
}

function getImageUrl(image: string) {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${import.meta.env.BASE_URL}images/${image}`;
}

function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const pathname = usePathname();
  const activeListingNumber = getActiveListingNumber(pathname);

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

  const activeListing = useMemo(() => {
    if (activeListingNumber === null) {
      return null;
    }

    return (
      parsedListings.find((listing) => listing.number === activeListingNumber) ??
      null
    );
  }, [parsedListings, activeListingNumber]);

  const activeListingImageUrls = useMemo(() => {
    if (!activeListing) {
      return [];
    }

    const sourceImages =
      activeListing.images && activeListing.images.length > 0
        ? activeListing.images
        : activeListing.image
          ? [activeListing.image]
          : [];

    return sourceImages.map(getImageUrl).filter(Boolean);
  }, [activeListing]);

  function resetFilters() {
    setSearch("");
    setCity("");
    setCategory("");
  }

  function closeActiveListing() {
    navigate("/");
  }

  return (
    <main style={styles.page}>
      <div className="page-container">
        <header className="page-header">
          <div style={styles.headerText}>
            <h1 style={styles.title}>Free Board</h1>
            <p style={styles.subtitle}>Доска объявлений работает.</p>
          </div>

          <div style={styles.counter}>
            {filteredListings.length} из {parsedListings.length} объявл.
          </div>
        </header>

        <NoticePanel />

        <DonatePanel />

        {loading && <StatusMessage>Загрузка объявлений...</StatusMessage>}

        {!loading && error && (
          <StatusMessage variant="error">Ошибка: {error}</StatusMessage>
        )}

        {!loading && !error && (
          <div className="page-layout">
            <aside className="filters-sidebar">
              <Filters
                search={search}
                city={city}
                category={category}
                cities={cities}
                categories={categories}
                hasActiveFilters={hasActiveFilters}
                onSearchChange={setSearch}
                onCityChange={setCity}
                onCategoryChange={setCategory}
                onResetFilters={resetFilters}
              />
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
      </div>

      {activeListing && (
        <ListingLightbox
          listing={activeListing}
          imageUrls={activeListingImageUrls}
          onClose={closeActiveListing}
        />
      )}
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "10px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: "#f3f4f6",
    color: "#111827",
    overflowX: "hidden",
  },

  headerText: {
    minWidth: 0,
  },

  title: {
    margin: 0,
    fontSize: "26px",
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },

  subtitle: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 500,
  },

  counter: {
    padding: "5px 9px",
    borderRadius: "999px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
};

export default HomePage;