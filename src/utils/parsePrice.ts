export function parsePriceAmount(priceText: string): number | null {
  const match = priceText.match(/\d+(?:[.,]\d+)?/);

  if (!match) {
    return null;
  }

  return parseFloat(match[0].replace(",", "."));
}
