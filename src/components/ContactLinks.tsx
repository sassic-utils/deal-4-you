import type { CSSProperties } from "react";

type ContactLinksProps = {
  contact: string;
};

function normalizePhone(value: string) {
  const trimmedValue = value.trim();

  const decodedValue = decodeURIComponent(trimmedValue)
    .replace("https://viber.click/", "")
    .replace("http://viber.click/", "")
    .replace("viber://chat?number=", "")
    .replace("tel:", "")
    .trim();

  const onlyPhoneChars = decodedValue.replace(/[^\d+]/g, "");

  if (!onlyPhoneChars) {
    return "";
  }

  return onlyPhoneChars.startsWith("+")
    ? onlyPhoneChars
    : `+${onlyPhoneChars}`;
}

function getValueAfterColon(line: string) {
  const colonIndex = line.indexOf(":");

  if (colonIndex === -1) {
    return line.trim();
  }

  return line.slice(colonIndex + 1).trim();
}

function ContactLinks({ contact }: ContactLinksProps) {
  const lines = contact
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let telegramUsername = "";
  let viberPhone = "";
  let phoneNumber = "";

  const unknownLines: string[] = [];

  lines.forEach((line) => {
    const lowerLine = line.toLowerCase();

    if (lowerLine.startsWith("telegram:")) {
      const value = getValueAfterColon(line);
      telegramUsername = value.replace("@", "").trim();
      return;
    }

    if (lowerLine.startsWith("viber:")) {
      const value = getValueAfterColon(line);
      viberPhone = normalizePhone(value);
      return;
    }

    if (
      lowerLine.startsWith("phone:") ||
      lowerLine.startsWith("tel:") ||
      lowerLine.startsWith("телефон:")
    ) {
      const value = getValueAfterColon(line);
      phoneNumber = normalizePhone(value);
      return;
    }

    if (lowerLine.includes("t.me/")) {
      const username = line.split("t.me/")[1]?.split(/[/?#\s]/)[0];

      if (username) {
        telegramUsername = username.replace("@", "").trim();
        return;
      }
    }

    if (lowerLine.includes("viber.click/")) {
      viberPhone = normalizePhone(line);
      return;
    }

    if (lowerLine.startsWith("viber://chat?number=")) {
      viberPhone = normalizePhone(line);
      return;
    }

    const phoneMatch = line.match(/(\+?\d[\d\s().-]{6,})/);

    if (phoneMatch?.[1] && !phoneNumber) {
      phoneNumber = normalizePhone(phoneMatch[1]);
      return;
    }

    unknownLines.push(line);
  });

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
    color: "#374151",
    whiteSpace: "pre-wrap",
    lineHeight: 1.3,
    fontSize: "13px",
    fontWeight: 600,
  },
};

export default ContactLinks;