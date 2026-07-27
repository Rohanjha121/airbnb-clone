export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  location_city: string;
  location_country: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  /** Comma-separated string from the backend */
  amenities: string;
  image_url: string;
  /** Newline-separated extra image URLs */
  extra_images: string;
  host_id: string;
  created_at: string;
}

export type ListingCategory =
  | "Beach"
  | "Mountains"
  | "Countryside"
  | "Pools"
  | "Islands"
  | "Lake"
  | "Skiing"
  | "Castles"
  | "Caves"
  | "Camping"
  | "Arctic"
  | "Desert"
  | "Barns"
  | "Lux";

export interface ListingFilters {
  category?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  guests?: number;
}
