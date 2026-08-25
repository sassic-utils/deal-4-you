export type Listing = {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  labels: string[];
  url: string;
  createdAt: string;
  updatedAt: string;
};

export type ParsedListing = Listing & {
  description: string;
  price: string;
  contact: string;
  image: string;
  city: string;
  category: string;
  status: string;
};