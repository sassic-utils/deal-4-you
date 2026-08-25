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

  return (
    <div style={styles.wrapper}>
      {lines.map((line, index) => {
        const lowerLine = line.toLowerCase();

        if (lowerLine.startsWith("telegram:")) {
          const value = getValueAfterColon(line);
          const username = value.replace("@", "").trim();

          if (!username) {
            return null;
          }

          return (
            <a
              key={`${line}-${index}`}
              href={`https://t.me/${username}`}
              target="_blank"
              rel="noreferrer"
              style={styles.link}
              title={`Telegram: @${username}`}
            >
              Telegram: @{username}
            </a>
          );
        }

        if (lowerLine.startsWith("viber:")) {
          const value = getValueAfterColon(line);
          const phone = normalizePhone(value);

          return (
            <div key={`${line}-${index}`} style={styles.contactGroup}>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                style={styles.link}
                title={`Viber: ${phone || value}`}
              >
                Viber: {phone || value}
              </a>

              {phone && (
                <a href={`tel:${phone}`} style={styles.phoneButton}>
                  Позвонить
                </a>
              )}
            </div>
          );
        }

        if (
          lowerLine.startsWith("phone:") ||
          lowerLine.startsWith("телефон:")
        ) {
          const value = getValueAfterColon(line);
          const phone = normalizePhone(value);

          if (!phone) {
            return null;
          }

          return (
            <div key={`${line}-${index}`} style={styles.contactGroup}>
              <a href={`tel:${phone}`} style={styles.link} title={phone}>
                Телефон: {phone}
              </a>

              <a href={`tel:${phone}`} style={styles.phoneButton}>
                Позвонить
              </a>
            </div>
          );
        }

        return (
          <p key={`${line}-${index}`} style={styles.text}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },
  contactGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4px",
    minWidth: 0,
  },
  link: {
    display: "block",
    maxWidth: "100%",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: "13px",
    lineHeight: 1.15,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  phoneButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 9px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: "12px",
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  },
  text: {
    margin: 0,
    color: "#374151",
    whiteSpace: "pre-wrap",
    lineHeight: 1.2,
    fontSize: "13px",
  },
};

export default ContactLinks;