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

export async function fetchListings() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/listings.json`);

  if (!response.ok) {
    throw new Error(`Failed to load listings.json: ${response.status}`);
  }

  return (await response.json()) as Listing[];
}

export function parseListing(listing: Listing): ParsedListing {
  return {
    ...listing,
    description: getSection(listing.body, "Description"),
    price: getSection(listing.body, "Price"),
    contact: getSection(listing.body, "Contact"),
    city: getLabelValue(listing.labels, "city"),
    category: getLabelValue(listing.labels, "category"),
    status: getLabelValue(listing.labels, "status"),
  };
}

export function parseListings(listings: Listing[]): ParsedListing[] {
  return listings.map(parseListing);
}