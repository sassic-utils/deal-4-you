import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { ParsedListing } from "../models/listing";
import Link from "./Link";

type ListingCardProps = {
  listing: ParsedListing;
};

function getImageUrl(image: string) {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${import.meta.env.BASE_URL}images/${image}`;
}

function ListingCard({ listing }: ListingCardProps) {
  const [mainImageFailed, setMainImageFailed] = useState(false);

  const imageUrls = useMemo(() => {
    const sourceImages =
      listing.images && listing.images.length > 0
        ? listing.images
        : listing.image
          ? [listing.image]
          : [];

    return sourceImages.map(getImageUrl).filter(Boolean);
  }, [listing.images, listing.image]);

  const mainImageSrc = imageUrls[0] || "";
  const hasMultipleImages = imageUrls.length > 1;
  const shouldShowMainImage = Boolean(mainImageSrc) && !mainImageFailed;
  const hasDetails = Boolean(listing.description || listing.contact);

  return (
    <article className="card-pin" style={styles.card}>
      <div style={styles.imageBox}>
        {shouldShowMainImage ? (
          <img
            src={mainImageSrc}
            alt={listing.title}
            style={styles.image}
            onError={() => setMainImageFailed(true)}
          />
        ) : (
          <div style={styles.imagePlaceholder}>
            <span style={styles.imageIcon}>🖼️</span>
            <span style={styles.imageText}>Фото</span>
          </div>
        )}

        {hasMultipleImages && (
          <div style={styles.imageCountBadge}>1 / {imageUrls.length}</div>
        )}
      </div>

      <div style={styles.content}>
        <div>
          <h2 style={styles.cardTitle} title={listing.title}>
            {listing.title}
          </h2>

          <div style={styles.meta}>
            {listing.city && (
              <span style={styles.label}>📍 {listing.city}</span>
            )}

            {listing.category && (
              <span style={styles.label}>🏷️ {listing.category}</span>
            )}
          </div>

          {listing.price && (
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Цена</h3>
              <p style={styles.price}>{listing.price}</p>
            </section>
          )}
        </div>

        <div style={styles.bottom}>
          {hasDetails && (
            <Link to={`/listing/${listing.number}`} style={styles.moreButton}>
              Подробнее
            </Link>
          )}

          <div style={styles.footer}>
            <span>
              Обновлено:{" "}
              {new Date(listing.updatedAt).toLocaleDateString("ru-RU")}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: "var(--card)",
    borderRadius: "10px",
    border: "1px solid var(--line)",
    overflow: "hidden",
    boxShadow: "var(--shadow)",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  imageBox: {
    position: "relative",
    width: "100%",
    aspectRatio: "4 / 3",
    background: "var(--card)",
    borderBottom: "1px solid var(--line)",
    overflow: "hidden",
    flexShrink: 0,
    padding: "8px",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--ink-faint)",
    background: "var(--paper)",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    background: "var(--card)",
    borderRadius: "6px",
  },

  imageIcon: {
    fontSize: "28px",
    lineHeight: 1,
    marginBottom: "6px",
  },

  imageText: {
    fontSize: "13px",
    fontWeight: 700,
  },

  imageCountBadge: {
    position: "absolute",
    right: "8px",
    bottom: "8px",
    padding: "4px 7px",
    borderRadius: "999px",
    background: "rgba(10, 14, 11, 0.7)",
    color: "#ffffff",
    fontSize: "11px",
    lineHeight: 1,
    fontWeight: 800,
  },

  content: {
    padding: "10px",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },

  cardTitle: {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.12,
    letterSpacing: "-0.03em",
    color: "var(--ink)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "8px",
  },

  label: {
    maxWidth: "100%",
    padding: "3px 7px",
    borderRadius: "4px",
    background: "var(--chip-bg)",
    color: "var(--chip-ink)",
    fontSize: "10px",
    lineHeight: 1.2,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  section: {
    marginTop: "8px",
  },

  sectionTitle: {
    margin: "0 0 3px",
    fontSize: "10px",
    lineHeight: 1.1,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--ink-faint)",
  },

  price: {
    margin: 0,
    color: "var(--ink)",
    fontWeight: 900,
    lineHeight: 1.1,
    fontSize: "18px",
    fontVariantNumeric: "tabular-nums",
  },

  bottom: {
    marginTop: "auto",
    paddingTop: "8px",
  },

  moreButton: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    background: "var(--accent)",
    color: "var(--accent-ink)",
    borderRadius: "6px",
    padding: "8px 10px",
    fontSize: "13px",
    lineHeight: 1.2,
    fontWeight: 800,
    textAlign: "center",
    textDecoration: "none",
    cursor: "pointer",
    marginBottom: "8px",
  },

  footer: {
    paddingTop: "7px",
    borderTop: "1px solid var(--line)",
    color: "var(--ink-faint)",
    fontSize: "11px",
    lineHeight: 1.2,
    fontWeight: 700,
  },
};

export default ListingCard;
