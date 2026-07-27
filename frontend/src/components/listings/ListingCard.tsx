"use client";

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

export default function ListingCard({ listing }: ListingCardProps) {
  const rating = getMockRating(listing.id);

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <ImageWithFallback
          src={listing.image_url}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />

        {/* Heart button */}
        <HeartButton listingId={listing.id} className="absolute top-3 right-3" />
      </div>

      {/* Info */}
      <div className="mt-2.5 space-y-0.5">
        {/* Row 1: location + rating */}
        <div className="flex items-center justify-between">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm truncate pr-2">
            {listing.location_city}, {listing.location_country}
          </p>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star size={12} className="fill-zinc-900 stroke-zinc-900 dark:fill-zinc-100 dark:stroke-zinc-100" />
            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{rating}</span>
          </div>
        </div>

        {/* Row 2: title */}
        <p className="text-zinc-500 dark:text-zinc-400 text-sm truncate">{listing.title}</p>

        {/* Row 3: price */}
        <p className="text-zinc-900 dark:text-zinc-100 text-sm pt-0.5">
          <span className="font-semibold">${listing.price_per_night.toFixed(0)}</span>
          <span className="text-zinc-500 dark:text-zinc-400"> / night</span>
        </p>
      </div>
    </Link>
  );
}
