export type ParsedContact = {
  telegramUsername: string;
  viberPhone: string;
  phoneNumber: string;
  unknownLines: string[];
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

export function parseContact(contact: string): ParsedContact {
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

    const phoneCandidate = line.match(/\+?\d[\d\s().-]{6,}\d/)?.[0];
    const digitCount = phoneCandidate?.replace(/\D/g, "").length ?? 0;

    if (phoneCandidate && !phoneNumber && digitCount >= 7 && digitCount <= 15) {
      phoneNumber = normalizePhone(phoneCandidate);
      return;
    }

    unknownLines.push(line);
  });

  return { telegramUsername, viberPhone, phoneNumber, unknownLines };
}
