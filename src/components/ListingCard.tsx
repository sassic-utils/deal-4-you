import type { CSSProperties } from "react";
import type { ParsedListing } from "../models/listing";
import ContactLinks from "./ContactLinks";

type ListingCardProps = {
  listing: ParsedListing;
};

function ListingCard({ listing }: ListingCardProps) {
  return (
    <article style={styles.card}>
      <div style={styles.imagePlaceholder}>
        {listing.image ? (
          <img
            src={`${import.meta.env.BASE_URL}images/${listing.image}`}
            alt={listing.title}
            style={styles.image}
          />
        ) : (
          <>
            <span style={styles.imageIcon}>🖼️</span>
            <span style={styles.imageText}>Фото</span>
          </>
        )}
      </div>

      <div style={styles.content}>
        <h2 style={styles.cardTitle} title={listing.title}>
          {listing.title}
        </h2>

        <div style={styles.meta}>
          {listing.city && <span style={styles.label}>📍 {listing.city}</span>}

          {listing.category && (
            <span style={styles.label}>🏷️ {listing.category}</span>
          )}

          {listing.status && (
            <span style={styles.label}>✅ {listing.status}</span>
          )}
        </div>

        {listing.description && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Описание</h3>
            <p style={styles.text} title={listing.description}>
              {listing.description}
            </p>
          </section>
        )}

        {listing.price && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Цена</h3>
            <p style={styles.price}>{listing.price}</p>
          </section>
        )}

        {listing.contact && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Контакт</h3>
            <ContactLinks contact={listing.contact} />
          </section>
        )}

        <div style={styles.footer}>
          <span>
            Обновлено:{" "}
            {new Date(listing.updatedAt).toLocaleDateString("ru-RU")}
          </span>
        </div>
      </div>
    </article>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
    minWidth: 0,
  },
  imagePlaceholder: {
    height: "72px",
    background:
      "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 50%, #e5e7eb 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    borderBottom: "1px solid #e5e7eb",
  },
  imageIcon: {
    fontSize: "22px",
    lineHeight: 1,
    marginBottom: "2px",
  },
  imageText: {
    fontSize: "11px",
    fontWeight: 700,
  },
  content: {
    padding: "10px",
    minWidth: 0,
  },
  cardTitle: {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.12,
    letterSpacing: "-0.03em",
    color: "#111827",
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
    borderRadius: "999px",
    background: "#e0f2fe",
    color: "#075985",
    fontSize: "11px",
    lineHeight: 1.2,
    fontWeight: 800,
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
    color: "#9ca3af",
  },
  text: {
    margin: 0,
    color: "#374151",
    lineHeight: 1.2,
    fontSize: "13px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  price: {
    margin: 0,
    color: "#111827",
    fontWeight: 900,
    lineHeight: 1.1,
    fontSize: "18px",
  },
  footer: {
    marginTop: "9px",
    paddingTop: "7px",
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "11px",
    lineHeight: 1.2,
    fontWeight: 700,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
};

export default ListingCard;