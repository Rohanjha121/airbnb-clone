"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Listing } from "@/types/listing";
import HeartButton from "@/components/common/HeartButton";
import ImageWithFallback from "@/components/common/ImageWithFallback";

interface ListingCardProps {
  listing: Listing;
}

// Deterministic mock rating based on listing id (for display only until reviews are built)
function getMockRating(id: string): string {
  const hash = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rating = 4.5 + (hash % 10) / 20; // 4.50 – 4.95
  return rating.toFixed(2);
}

function ListingCardComponent({ listing }: ListingCardProps) {
  const rating = useMemo(() => getMockRating(listing.id), [listing.id]);

  return (
    <Link
      href={`/listings/${listing.id}`}
      aria-label={`${listing.title} in ${listing.location_city}, ${listing.location_country}. $${listing.price_per_night} per night.`}
      className="group block cursor-pointer transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 rounded-2xl"
    >
      {/* Image container */}
      <div className="relative aspect-[20/19] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 shadow-xs group-hover:shadow-md transition-all duration-300">
        <ImageWithFallback
          src={listing.image_url}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          unoptimized
        />

        {/* Heart Wishlist button */}
        <HeartButton listingId={listing.id} className="absolute top-3 right-3 z-10" />
      </div>

      {/* Info Section */}
      <div className="mt-3 space-y-0.5">
        {/* Row 1: Location & Rating */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm truncate">
            {listing.location_city}, {listing.location_country}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={13} className="fill-zinc-900 stroke-zinc-900 dark:fill-zinc-100 dark:stroke-zinc-100" />
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{rating}</span>
          </div>
        </div>

        {/* Row 2: Title */}
        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm truncate font-normal">
          {listing.title}
        </p>

        {/* Row 3: Category / Guest details */}
        <p className="text-zinc-400 dark:text-zinc-500 text-xs truncate">
          {listing.category} · Up to {listing.max_guests} guests
        </p>

        {/* Row 4: Price */}
        <p className="text-zinc-900 dark:text-zinc-100 text-sm pt-1">
          <span className="font-bold text-base">${listing.price_per_night.toFixed(0)}</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal"> night</span>
        </p>
      </div>
    </Link>
  );
}

const ListingCard = memo(ListingCardComponent);
export default ListingCard;
