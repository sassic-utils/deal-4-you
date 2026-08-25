import type { Listing, ParsedListing } from "../models/listing";

function getLabelValue(labels: string[], prefix: string) {
  const normalizedPrefix = `${prefix.toLowerCase()}:`;

  const found = labels.find((label) =>
    label.toLowerCase().startsWith(normalizedPrefix)
  );

  if (!found) {
    return "";
  }

  return found.slice(found.indexOf(":") + 1).trim();
}

function getSection(body: string, sectionName: string) {
  const regex = new RegExp(
    `##\\s*${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    "i"
  );

  const match = body.match(regex);

  return match?.[1]?.trim() ?? "";
}

function parseImagesText(imagesSection: string) {
  return imagesSection
    .split(/\r?\n/)
    .map((line) => line.trim())
    .map((line) => line.replace(/^[-*]\s*/, ""))
    .map((line) => {
      // Markdown image: ![alt](image.jpg)
      const markdownImageMatch = line.match(/!\[[^\]]*]\(([^)]+)\)/);

      if (markdownImageMatch?.[1]) {
        return markdownImageMatch[1].trim();
      }

      return line;
    })
    .filter(Boolean);
}

function parseImagesSection(body: string) {
  const imagesSection =
    getSection(body, "Images") ||
    getSection(body, "Image") ||
    getSection(body, "Photos") ||
    getSection(body, "Photo") ||
    getSection(body, "Фото");

  if (!imagesSection) {
    return [];
  }

  return parseImagesText(imagesSection);
}

export async function fetchListings() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/listings.json`);

  if (!response.ok) {
    throw new Error(`Failed to load listings.json: ${response.status}`);
  }

  return (await response.json()) as Listing[];
}

export function parseListing(listing: Listing): ParsedListing {
  const images = parseImagesSection(listing.body);

  return {
    ...listing,
    description: getSection(listing.body, "Description"),
    price: getSection(listing.body, "Price"),
    contact: getSection(listing.body, "Contact"),
    image: images[0] || "",
    images,
    imageCount: images.length,
    city: getLabelValue(listing.labels, "city"),
    category: getLabelValue(listing.labels, "category"),
    status: getLabelValue(listing.labels, "status"),
  };
}

export function parseListings(listings: Listing[]): ParsedListing[] {
  return listings.map(parseListing);
}