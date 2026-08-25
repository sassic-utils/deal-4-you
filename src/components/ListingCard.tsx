import type { CSSProperties } from "react";
import type { ParsedListing } from "../models/listing";

type ListingCardProps = {
  listing: ParsedListing;
};

function ListingCard({ listing }: ListingCardProps) {
  return (
    <article style={styles.card}>
      <div style={styles.imagePlaceholder}>
        <span style={styles.imageIcon}>🖼️</span>
        <span style={styles.imageText}>Фото объявления</span>
      </div>

      <div style={styles.content}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>{listing.title}</h2>
          <span style={styles.issueNumber}>#{listing.number}</span>
        </div>

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
            <p style={styles.text}>{listing.description}</p>
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
            <p style={styles.text}>{listing.contact}</p>
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
    borderRadius: "24px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
  },
  imagePlaceholder: {
    height: "220px",
    background:
      "linear-gradient(135deg, #e0f2fe 0%, #f3f4f6 50%, #e5e7eb 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    borderBottom: "1px solid #e5e7eb",
  },
  imageIcon: {
    fontSize: "48px",
    lineHeight: 1,
    marginBottom: "12px",
  },
  imageText: {
    fontSize: "16px",
    fontWeight: 700,
  },
  content: {
    padding: "24px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
  },
  cardTitle: {
    margin: 0,
    fontSize: "28px",
    lineHeight: 1.15,
    letterSpacing: "-0.03em",
  },
  issueNumber: {
    color: "#6b7280",
    fontSize: "20px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "20px",
  },
  label: {
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#e0f2fe",
    color: "#075985",
    fontSize: "15px",
    fontWeight: 700,
  },
  section: {
    marginTop: "24px",
  },
  sectionTitle: {
    margin: "0 0 8px",
    fontSize: "14px",
    lineHeight: 1.2,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#9ca3af",
  },
  text: {
    margin: 0,
    color: "#374151",
    whiteSpace: "pre-wrap",
    lineHeight: 1.5,
    fontSize: "20px",
  },
  price: {
    margin: 0,
    color: "#111827",
    fontWeight: 800,
    lineHeight: 1.2,
    fontSize: "28px",
  },
  footer: {
    marginTop: "28px",
    paddingTop: "18px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    color: "#6b7280",
    fontSize: "16px",
    fontWeight: 600,
  },
};

export default ListingCard;