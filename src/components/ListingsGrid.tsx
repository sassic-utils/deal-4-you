import type { ParsedListing } from "../models/listing";
import ListingCard from "./ListingCard";

type ListingsGridProps = {
  listings: ParsedListing[];
};

function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <section className="listings-grid">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </section>
  );
}

export default ListingsGrid;