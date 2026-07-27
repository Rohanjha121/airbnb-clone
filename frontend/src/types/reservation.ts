import type { Listing } from "./listing";
import type { User } from "./user";

export interface Reservation {
  id: string;
  listing_id: string;
  guest_id: string;
  check_in: string; // ISO date string "YYYY-MM-DD"
  check_out: string; // ISO date string "YYYY-MM-DD"
  guests: number;
  total_price: number;
  created_at: string;
  // Populated by the backend when fetching with joins
  listing?: Listing;
  guest?: User;
}

export interface CreateReservationPayload {
  listing_id: string;
  check_in: string;
  check_out: string;
  guests: number;
}
