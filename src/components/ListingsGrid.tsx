import type { CSSProperties } from "react";
import type { ParsedListing } from "../models/listing";
import ListingCard from "./ListingCard";

type ListingsGridProps = {
  listings: ParsedListing[];
};

function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <section style={styles.grid}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  grid: {
    maxWidth: "1024px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "10px",
  },
};

export default ListingsGrid;