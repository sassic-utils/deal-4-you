import { useEffect, useRef, useState } from "react";
import type { CSSProperties, TouchEvent } from "react";
import type { ParsedListing } from "../models/listing";
import ContactLinks from "./ContactLinks";
import Modal from "./Modal";
import Link from "./Link";
import { parseContact } from "../utils/parseContact";

type ListingLightboxProps = {
  listing: ParsedListing;
  imageUrls: string[];
  onClose: () => void;
};

function ListingLightbox({ listing, imageUrls, onClose }: ListingLightboxProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const isSold = listing.state !== "open";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = isSold
      ? `${listing.title} (продано) — Free Board`
      : `${listing.title} — Free Board`;

    return () => {
      document.title = previousTitle;
    };
  }, [listing.title, isSold]);

  const sellerTelegram = listing.contact
    ? parseContact(listing.contact).telegramUsername
    : "";

  const primaryCategory = listing.categories[0] ?? "";
  const similarListingsLink = primaryCategory
    ? `/?category=${encodeURIComponent(primaryCategory)}`
    : "/";

  const hasImages = imageUrls.length > 0;
  const hasMultipleImages = imageUrls.length > 1;
  const currentImageSrc = imageUrls[currentImageIndex] || "";
  const shouldShowCurrentImage =
    Boolean(currentImageSrc) && !failedImages[currentImageSrc];

  function markImageFailed(imageSrc: string) {
    if (!imageSrc) {
      return;
    }

    setFailedImages((current) => ({
      ...current,
      [imageSrc]: true,
    }));
  }

  function showPreviousImage() {
    if (!hasMultipleImages) {
      return;
    }

    setCurrentImageIndex((current) =>
      current === 0 ? imageUrls.length - 1 : current - 1
    );
  }

  function showNextImage() {
    if (!hasMultipleImages) {
      return;
    }

    setCurrentImageIndex((current) =>
      current === imageUrls.length - 1 ? 0 : current + 1
    );
  }

  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD_PX = 40;

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
      return;
    }

    if (deltaX > 0) {
      showPreviousImage();
    } else {
      showNextImage();
    }
  }

  function handleTouchCancel() {
    touchStartX.current = null;
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasMultipleImages, imageUrls.length]);

  return (
    <Modal
      onClose={onClose}
      ariaLabelledBy={`listing-title-${listing.id}`}
      modalStyle={styles.modal}
      closeButtonStyle={styles.closeButton}
    >
      <div
        style={styles.modalImageBox}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {shouldShowCurrentImage ? (
          <img
            src={currentImageSrc}
            alt={`${listing.title}, фото ${currentImageIndex + 1}`}
            style={isSold ? { ...styles.image, ...styles.imageSold } : styles.image}
            width={800}
            height={600}
            onError={() => markImageFailed(currentImageSrc)}
          />
        ) : (
          <div style={styles.imagePlaceholder}>
            <span style={styles.imageIcon}>🖼️</span>
            <span style={styles.imageText}>Фото</span>
          </div>
        )}

        {isSold && <div style={styles.soldStamp}>ПРОДАНО</div>}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              style={{ ...styles.galleryButton, ...styles.galleryButtonLeft }}
              onClick={showPreviousImage}
              aria-label="Предыдущее фото"
            >
              ‹
            </button>

            <button
              type="button"
              style={{ ...styles.galleryButton, ...styles.galleryButtonRight }}
              onClick={showNextImage}
              aria-label="Следующее фото"
            >
              ›
            </button>

            <div style={styles.modalImageCounter}>
              {currentImageIndex + 1} / {imageUrls.length}
            </div>
          </>
        )}

        {!hasImages && <div style={styles.modalImageCounter}>Нет фото</div>}
      </div>

      {hasMultipleImages && (
        <div style={styles.thumbnails}>
          {imageUrls.map((imageUrl, index) => {
            const isActive = index === currentImageIndex;
            const isFailed = failedImages[imageUrl];

            return (
              <button
                key={imageUrl}
                type="button"
                style={{
                  ...styles.thumbnailButton,
                  ...(isActive ? styles.thumbnailButtonActive : {}),
                }}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Открыть фото ${index + 1}`}
              >
                {!isFailed ? (
                  <img
                    src={imageUrl}
                    alt=""
                    style={styles.thumbnailImage}
                    onError={() => markImageFailed(imageUrl)}
                  />
                ) : (
                  <span style={styles.thumbnailPlaceholder}>🖼️</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div style={styles.modalContent}>
        <h2 id={`listing-title-${listing.id}`} style={styles.modalTitle}>
          {listing.title}
        </h2>

        <div style={styles.meta}>
          {listing.city && <span style={styles.label}>📍 {listing.city}</span>}

          {listing.categories.map((category) => (
            <span key={category} style={styles.label}>
              🏷️ {category}
            </span>
          ))}
        </div>

        {isSold && (
          <div style={styles.soldNotice}>
            <p style={styles.soldNoticeText}>Товар продан.</p>
            <Link to={similarListingsLink} style={styles.soldNoticeLink}>
              Показать похожие
            </Link>
          </div>
        )}

        {listing.price && (
          <section style={styles.modalSection}>
            <h3 style={styles.sectionTitle}>Цена</h3>
            <p style={styles.modalPrice}>{listing.price}</p>
          </section>
        )}

        {!isSold && listing.description && (
          <section style={styles.modalSection}>
            <h3 style={styles.sectionTitle}>Описание</h3>
            <p style={styles.modalText}>{listing.description}</p>
          </section>
        )}

        {!isSold && listing.contact && (
          <section style={styles.modalSection}>
            <h3 style={styles.sectionTitle}>Контакт</h3>
            <ContactLinks contact={listing.contact} />

            {sellerTelegram && (
              <Link
                to={`/?seller=${encodeURIComponent(sellerTelegram)}`}
                style={styles.sellerLink}
              >
                Все объявления продавца @{sellerTelegram}
              </Link>
            )}
          </section>
        )}

        <div style={styles.modalFooter}>
          Обновлено: {new Date(listing.updatedAt).toLocaleDateString("ru-RU")}
        </div>
      </div>
    </Modal>
  );
}

const styles: Record<string, CSSProperties> = {
  modal: {
    maxWidth: "720px",
  },

  closeButton: {
    top: "10px",
    right: "10px",
    zIndex: 3,
    width: "34px",
    height: "34px",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.16)",
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

  imageSold: {
    filter: "grayscale(0.6)",
    opacity: 0.75,
  },

  soldStamp: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-8deg)",
    zIndex: 2,
    padding: "8px 18px",
    border: "3px solid var(--ink-faint)",
    borderRadius: "8px",
    color: "var(--ink-faint)",
    background: "color-mix(in srgb, var(--card) 70%, transparent)",
    fontSize: "22px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    pointerEvents: "none",
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

  sectionTitle: {
    margin: "0 0 3px",
    fontSize: "10px",
    lineHeight: 1.1,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--ink-faint)",
  },

  modalImageBox: {
    position: "relative",
    width: "100%",
    aspectRatio: "16 / 9",
    background: "var(--card)",
    borderBottom: "1px solid var(--line)",
    overflow: "hidden",
    padding: "10px",
    touchAction: "pan-y",
  },

  galleryButton: {
    position: "absolute",
    top: "50%",
    zIndex: 2,
    width: "38px",
    height: "38px",
    transform: "translateY(-50%)",
    borderRadius: "999px",
    border: "1px solid rgba(255, 255, 255, 0.72)",
    background: "rgba(10, 14, 11, 0.58)",
    color: "#ffffff",
    fontSize: "30px",
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  galleryButtonLeft: {
    left: "10px",
  },

  galleryButtonRight: {
    right: "10px",
  },

  modalImageCounter: {
    position: "absolute",
    left: "50%",
    bottom: "10px",
    transform: "translateX(-50%)",
    padding: "5px 9px",
    borderRadius: "999px",
    background: "rgba(10, 14, 11, 0.72)",
    color: "#ffffff",
    fontSize: "12px",
    lineHeight: 1,
    fontWeight: 800,
  },

  thumbnails: {
    display: "flex",
    gap: "8px",
    padding: "10px 12px 0",
    overflowX: "auto",
  },

  thumbnailButton: {
    width: "58px",
    height: "44px",
    flex: "0 0 auto",
    padding: 0,
    borderRadius: "8px",
    border: "2px solid transparent",
    background: "var(--card)",
    overflow: "hidden",
    cursor: "pointer",
  },

  thumbnailButtonActive: {
    borderColor: "var(--accent)",
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    background: "var(--card)",
  },

  thumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    background: "var(--paper)",
  },

  modalContent: {
    padding: "16px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "24px",
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
    color: "var(--ink)",
  },

  modalSection: {
    marginTop: "14px",
  },

  modalPrice: {
    margin: 0,
    color: "var(--ink)",
    fontWeight: 900,
    lineHeight: 1.1,
    fontSize: "24px",
    fontVariantNumeric: "tabular-nums",
  },

  modalText: {
    margin: 0,
    color: "var(--ink-soft)",
    lineHeight: 1.45,
    fontSize: "15px",
    whiteSpace: "pre-wrap",
  },

  soldNotice: {
    marginTop: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    background: "color-mix(in srgb, var(--ink) 6%, var(--paper))",
    border: "1px solid var(--line)",
  },

  soldNoticeText: {
    margin: "0 0 4px",
    color: "var(--ink)",
    fontSize: "14px",
    fontWeight: 800,
  },

  soldNoticeLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "8px",
    minHeight: "36px",
    padding: "9px 15px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "15px",
    fontWeight: 900,
    lineHeight: 1,
    whiteSpace: "nowrap",
    textDecoration: "none",
  },

  sellerLink: {
    display: "inline-flex",
    marginTop: "10px",
    color: "var(--accent)",
    fontSize: "13px",
    fontWeight: 800,
    textDecoration: "none",
  },

  modalFooter: {
    marginTop: "16px",
    paddingTop: "10px",
    borderTop: "1px solid var(--line)",
    color: "var(--ink-faint)",
    fontSize: "12px",
    lineHeight: 1.2,
    fontWeight: 700,
  },
};

export default ListingLightbox;
