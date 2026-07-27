"use client";

import ListingCard from "./ListingCard";
import ListingCardSkeleton from "./ListingCardSkeleton";
import type { Listing } from "@/types/listing";
import { SearchX, WifiOff } from "lucide-react";

interface ListingGridProps {
  listings: Listing[];
  isLoading: boolean;
  isError: boolean;
  category: string | null;
}

const SKELETON_COUNT = 8;

export default function ListingGrid({
  listings,
  isLoading,
  isError,
  category,
}: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="bg-red-50 dark:bg-red-950/60 rounded-full p-5">
          <WifiOff size={36} className="text-red-500 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
            Could not load listings
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm max-w-sm">
            The backend server might not be running. Start it with{" "}
            <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-xs">
              python -m uvicorn app.main:app --reload
            </code>{" "}
            in the <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-xs">backend/</code> folder.
          </p>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full p-5">
          <SearchX size={36} className="text-zinc-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">No exact matches</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            {category
              ? `There are no listings in the "${category}" category yet.`
              : "Try adjusting your filters to find what you're looking for."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
