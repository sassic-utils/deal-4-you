import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import ListingsGrid from "../components/ListingsGrid";
import StatusMessage from "../components/StatusMessage";
import ListingLightbox from "../components/ListingLightbox";
import Modal from "../components/Modal";
import type { Listing } from "../models/listing";
import { fetchListings, parseListings } from "../services/listingsService";
import NoticePanel from "../components/NoticePanel";
import DonatePanel from "../components/DonatePanel";
import Filters from "../components/Filters";
import type { SortOption } from "../components/Filters";
import { usePathname } from "../hooks/usePathname";
import { buildHref, getPathname, navigate } from "../router";
import { parseContact } from "../utils/parseContact";
import { parsePriceAmount } from "../utils/parsePrice";

const LISTING_PATH_PATTERN = /^\/listing\/(\d+)$/;
const SORT_OPTIONS: SortOption[] = ["newest", "price-asc", "price-desc"];
const DEFAULT_SORT: SortOption = "newest";

function getActiveListingNumber(pathname: string) {
  const match = pathname.match(LISTING_PATH_PATTERN);
  return match ? Number(match[1]) : null;
}

function getFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const sortParam = params.get("sort");

  return {
    search: params.get("q") ?? "",
    city: params.get("city") ?? "",
    category: params.get("category") ?? "",
    seller: params.get("seller") ?? "",
    sortBy: SORT_OPTIONS.includes(sortParam as SortOption)
      ? (sortParam as SortOption)
      : DEFAULT_SORT,
  };
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

  const [search, setSearch] = useState(() => getFiltersFromUrl().search);
  const [city, setCity] = useState(() => getFiltersFromUrl().city);
  const [category, setCategory] = useState(() => getFiltersFromUrl().category);
  const [seller, setSeller] = useState(() => getFiltersFromUrl().seller);
  const [sortBy, setSortBy] = useState(() => getFiltersFromUrl().sortBy);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const pathname = usePathname();
  const activeListingNumber = getActiveListingNumber(pathname);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    if (seller) params.set("seller", seller);
    if (sortBy !== DEFAULT_SORT) params.set("sort", sortBy);

    const queryString = params.toString();
    const url = buildHref("/") + (queryString ? `?${queryString}` : "");

    window.history.replaceState({}, "", url);
  }, [search, city, category, seller, sortBy, pathname]);

  useEffect(() => {
    function handlePopState() {
      if (getPathname() !== "/") {
        return;
      }

      const filters = getFiltersFromUrl();
      setSearch(filters.search);
      setCity(filters.city);
      setCategory(filters.category);
      setSeller(filters.seller);
      setSortBy(filters.sortBy);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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

  const activeListings = useMemo(
    () => parsedListings.filter((listing) => listing.state === "open"),
    [parsedListings]
  );

  const cities = useMemo(() => {
    return Array.from(
      new Set(activeListings.map((listing) => listing.city).filter(Boolean))
    ).sort();
  }, [activeListings]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(activeListings.flatMap((listing) => listing.categories))
    ).sort();
  }, [activeListings]);

  const filteredListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return activeListings.filter((listing) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          listing.title,
          listing.description,
          listing.city,
          ...listing.categories,
          listing.price,
          listing.contact,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCity = !city || listing.city === city;
      const matchesCategory = !category || listing.categories.includes(category);

      const matchesSeller =
        !seller ||
        (listing.contact &&
          parseContact(listing.contact).telegramUsername.toLowerCase() ===
            seller.toLowerCase());

      return matchesSearch && matchesCity && matchesCategory && matchesSeller;
    });
  }, [activeListings, search, city, category, seller]);

  const sortedListings = useMemo(() => {
    if (sortBy === "newest") {
      return [...filteredListings].sort(
        (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
      );
    }

    const direction = sortBy === "price-asc" ? 1 : -1;

    return [...filteredListings].sort((a, b) => {
      const priceA = parsePriceAmount(a.price);
      const priceB = parsePriceAmount(b.price);

      if (priceA === null && priceB === null) return 0;
      if (priceA === null) return 1;
      if (priceB === null) return -1;

      return (priceA - priceB) * direction;
    });
  }, [filteredListings, sortBy]);

  const activeFilterCount = [search, city, category, seller].filter(
    Boolean
  ).length;
  const hasActiveFilters = activeFilterCount > 0;

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
    setSeller("");
  }

  function clearSellerFilter() {
    setSeller("");
  }

  function closeActiveListing() {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    if (seller) params.set("seller", seller);
    if (sortBy !== DEFAULT_SORT) params.set("sort", sortBy);

    const queryString = params.toString();
    navigate("/" + (queryString ? `?${queryString}` : ""));
  }

  return (
    <main style={styles.page}>
      <div className="page-container">
        <header className="page-header">
          <div style={styles.headerText}>
            <h1 style={styles.title}>
              Free <span style={styles.titleAccent}>Board</span>
            </h1>
            <p style={styles.subtitle}>Доска объявлений работает.</p>
          </div>

          <div style={styles.counter}>
            {filteredListings.length} из {activeListings.length} объявл.
          </div>
        </header>

        {seller && (
          <div style={styles.sellerBanner}>
            <span>
              Объявления продавца <strong>@{seller}</strong>
            </span>

            <button
              type="button"
              style={styles.sellerBannerButton}
              onClick={clearSellerFilter}
            >
              Сбросить
            </button>
          </div>
        )}

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
                sortBy={sortBy}
                cities={cities}
                categories={categories}
                hasActiveFilters={hasActiveFilters}
                onSearchChange={setSearch}
                onCityChange={setCity}
                onCategoryChange={setCategory}
                onSortChange={setSortBy}
                onResetFilters={resetFilters}
              />
            </aside>

            <section className="results-area">
              {filteredListings.length === 0 ? (
                <StatusMessage>По фильтрам ничего не найдено.</StatusMessage>
              ) : (
                <ListingsGrid listings={sortedListings} />
              )}
            </section>
          </div>
        )}
      </div>

      {!loading && !error && (
        <div className="mobile-filter-bar">
          <button type="button" onClick={() => setIsFilterSheetOpen(true)}>
            Фильтры{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
        </div>
      )}

      {isFilterSheetOpen && (
        <Modal
          onClose={() => setIsFilterSheetOpen(false)}
          ariaLabelledBy="filter-sheet-title"
          overlayStyle={styles.sheetOverlay}
          modalStyle={styles.sheetModal}
        >
          <div style={styles.sheetHeader}>
            <h2 id="filter-sheet-title" style={styles.sheetTitle}>
              Фильтры
            </h2>

            {hasActiveFilters && (
              <button
                type="button"
                style={styles.sheetResetButton}
                onClick={resetFilters}
              >
                Сбросить
              </button>
            )}
          </div>

          <Filters
            search={search}
            city={city}
            category={category}
            sortBy={sortBy}
            cities={cities}
            categories={categories}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearch}
            onCityChange={setCity}
            onCategoryChange={setCategory}
            onSortChange={setSortBy}
            onResetFilters={resetFilters}
          />

          <button
            type="button"
            style={styles.sheetApplyButton}
            onClick={() => setIsFilterSheetOpen(false)}
          >
            Показать {filteredListings.length} объявл.
          </button>
        </Modal>
      )}

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
    fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif',
    background: "var(--paper)",
    color: "var(--ink)",
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
    fontWeight: 900,
    textTransform: "uppercase",
  },

  titleAccent: {
    textDecoration: "underline solid var(--accent) 4px",
    textUnderlineOffset: "5px",
  },

  subtitle: {
    margin: "4px 0 0",
    color: "var(--ink-soft)",
    fontSize: "13px",
    fontWeight: 500,
  },

  counter: {
    padding: "5px 9px",
    borderRadius: "999px",
    background: "var(--card)",
    border: "1px solid var(--line)",
    color: "var(--ink-soft)",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
  },

  sellerBanner: {
    width: "100%",
    minHeight: "33px",
    marginBottom: "10px",
    padding: "7px 9px 7px 11px",
    borderRadius: "12px",
    background: "color-mix(in srgb, var(--accent) 10%, var(--card))",
    border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--line))",
    color: "var(--ink)",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.25,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },

  sellerBannerButton: {
    flexShrink: 0,
    border: "none",
    background: "transparent",
    color: "var(--accent)",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
    padding: 0,
  },

  sheetOverlay: {
    alignItems: "flex-end",
    padding: 0,
  },

  sheetModal: {
    width: "100%",
    maxWidth: "100%",
    maxHeight: "85vh",
    borderRadius: "16px 16px 0 0",
  },

  sheetHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 56px 4px 18px",
  },

  sheetTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 800,
    color: "var(--ink)",
  },

  sheetResetButton: {
    border: "none",
    background: "transparent",
    color: "var(--accent)",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
    padding: 0,
  },

  sheetApplyButton: {
    display: "block",
    width: "calc(100% - 36px)",
    margin: "14px 18px calc(18px + env(safe-area-inset-bottom, 0px))",
    border: "none",
    borderRadius: "999px",
    background: "var(--accent)",
    color: "var(--accent-ink)",
    fontSize: "14px",
    fontWeight: 800,
    padding: "12px",
    cursor: "pointer",
  },
};

export default HomePage;