import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { ParsedListing } from "../models/listing";
import ContactLinks from "./ContactLinks";

type ListingCardProps = {
  listing: ParsedListing;
};

function ListingCard({ listing }: ListingCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const imageSrc = listing.image
    ? listing.image.startsWith("http")
      ? listing.image
      : `${import.meta.env.BASE_URL}images/${listing.image}`
    : "";

  const hasDetails = Boolean(listing.description || listing.contact);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <article style={styles.card}>
        <div style={styles.imageBox}>
          {imageSrc ? (
            <img src={imageSrc} alt={listing.title} style={styles.image} />
          ) : (
            <div style={styles.imagePlaceholder}>
              <span style={styles.imageIcon}>🖼️</span>
              <span style={styles.imageText}>Фото</span>
            </div>
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

            {listing.description && (
              <section style={styles.section}>
                <h3 style={styles.sectionTitle}>Описание</h3>
                <p style={styles.textPreview} title={listing.description}>
                  {listing.description}
                </p>
              </section>
            )}
          </div>

          <div style={styles.bottom}>
            {hasDetails && (
              <button
                type="button"
                style={styles.moreButton}
                onClick={() => setIsOpen(true)}
              >
                Подробнее
              </button>
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

      {isOpen && (
        <div
          style={styles.modalOverlay}
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          <div
            style={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`listing-title-${listing.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              style={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>

            <div style={styles.modalImageBox}>
              {imageSrc ? (
                <img src={imageSrc} alt={listing.title} style={styles.image} />
              ) : (
                <div style={styles.imagePlaceholder}>
                  <span style={styles.imageIcon}>🖼️</span>
                  <span style={styles.imageText}>Фото</span>
                </div>
              )}
            </div>

            <div style={styles.modalContent}>
              <h2 id={`listing-title-${listing.id}`} style={styles.modalTitle}>
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
                <section style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>Цена</h3>
                  <p style={styles.modalPrice}>{listing.price}</p>
                </section>
              )}

              {listing.description && (
                <section style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>Описание</h3>
                  <p style={styles.modalText}>{listing.description}</p>
                </section>
              )}

              {listing.contact && (
                <section style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>Контакт</h3>
                  <ContactLinks contact={listing.contact} />
                </section>
              )}

              <div style={styles.modalFooter}>
                Обновлено:{" "}
                {new Date(listing.updatedAt).toLocaleDateString("ru-RU")}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  imageBox: {
    width: "100%",
    aspectRatio: "4 / 3",
    background:
      "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 50%, #e5e7eb 100%)",
    borderBottom: "1px solid #e5e7eb",
    overflow: "hidden",
    flexShrink: 0,
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
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

  textPreview: {
    margin: 0,
    color: "#374151",
    lineHeight: 1.25,
    fontSize: "13px",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  price: {
    margin: 0,
    color: "#111827",
    fontWeight: 900,
    lineHeight: 1.1,
    fontSize: "18px",
  },

  bottom: {
    marginTop: "auto",
    paddingTop: "8px",
  },

  moreButton: {
    width: "100%",
    border: "1px solid #bae6fd",
    background: "#f0f9ff",
    color: "#0369a1",
    borderRadius: "10px",
    padding: "7px 10px",
    fontSize: "13px",
    lineHeight: 1.2,
    fontWeight: 800,
    cursor: "pointer",
    marginBottom: "8px",
  },

  footer: {
    paddingTop: "7px",
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "11px",
    lineHeight: 1.2,
    fontWeight: 700,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "rgba(15, 23, 42, 0.58)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },

  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "720px",
    maxHeight: "90vh",
    overflow: "auto",
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.35)",
  },

  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 2,
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#111827",
    fontSize: "24px",
    lineHeight: 1,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.16)",
  },

  modalImageBox: {
    width: "100%",
    aspectRatio: "16 / 9",
    background:
      "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 50%, #e5e7eb 100%)",
    borderBottom: "1px solid #e5e7eb",
    overflow: "hidden",
  },

  modalContent: {
    padding: "16px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "24px",
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
    color: "#111827",
  },

  modalSection: {
    marginTop: "14px",
  },

  modalPrice: {
    margin: 0,
    color: "#111827",
    fontWeight: 900,
    lineHeight: 1.1,
    fontSize: "24px",
  },

  modalText: {
    margin: 0,
    color: "#374151",
    lineHeight: 1.45,
    fontSize: "15px",
    whiteSpace: "pre-wrap",
  },

  modalFooter: {
    marginTop: "16px",
    paddingTop: "10px",
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: 1.2,
    fontWeight: 700,
  },
};

export default ListingCard;