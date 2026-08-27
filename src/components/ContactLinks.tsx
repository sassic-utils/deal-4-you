import type { CSSProperties } from "react";
import { parseContact } from "../utils/parseContact";

type ContactLinksProps = {
  contact: string;
};

function ContactLinks({ contact }: ContactLinksProps) {
  const { telegramUsername, viberPhone, phoneNumber, unknownLines } =
    parseContact(contact);

  const callPhone = phoneNumber || viberPhone;

  const hasButtons = Boolean(telegramUsername || viberPhone || callPhone);

  if (!hasButtons) {
    return (
      <div style={styles.wrapper}>
        {unknownLines.length > 0 ? (
          unknownLines.map((line, index) => (
            <p key={`${line}-${index}`} style={styles.text}>
              {line}
            </p>
          ))
        ) : (
          <p style={styles.text}>{contact}</p>
        )}
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.actions}>
        {telegramUsername && (
          <a
            href={`https://t.me/${telegramUsername}`}
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.button, ...styles.telegramButton }}
            title={`Telegram: @${telegramUsername}`}
          >
            Telegram
          </a>
        )}

        {viberPhone && (
          <a
            href={`https://viber.click/${viberPhone.replace("+", "")}`}
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.button, ...styles.viberButton }}
            title={`Viber: ${viberPhone}`}
          >
            Viber
          </a>
        )}

        {callPhone && (
          <a
            href={`tel:${callPhone}`}
            style={{ ...styles.button, ...styles.phoneButton }}
            title={`Позвонить: ${callPhone}`}
          >
            Позвонить
          </a>
        )}
      </div>

      {unknownLines.length > 0 && (
        <div style={styles.notes}>
          {unknownLines.map((line, index) => (
            <p key={`${line}-${index}`} style={styles.text}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    minWidth: 0,
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "6px",
  },

  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "36px",
    padding: "9px 15px",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: "15px",
    lineHeight: 1,
    whiteSpace: "nowrap",
  },

  telegramButton: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },

  viberButton: {
    background: "#ede9fe",
    color: "#6d28d9",
  },

  phoneButton: {
    background: "#dcfce7",
    color: "#166534",
  },

  notes: {
    marginTop: "8px",
  },

  text: {
    margin: 0,
    color: "var(--ink-soft)",
    whiteSpace: "pre-wrap",
    lineHeight: 1.3,
    fontSize: "13px",
    fontWeight: 600,
  },
};

export default ContactLinks;