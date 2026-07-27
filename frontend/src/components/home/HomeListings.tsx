"use client";

import { useMemo } from "react";
import { MapPin, Users, X, Filter } from "lucide-react";
import CategoryBar from "@/components/CategoryBar";
import ListingGrid from "@/components/listings/ListingGrid";
import { useListings } from "@/hooks/useListings";
import { useSearch } from "@/context/SearchContext";

export default function HomeListings() {
  const {
    location,
    guests,
    category,
    checkIn,
    checkOut,
    minPrice,
    maxPrice,
    setCategory,
    clearFilters,
    hasActiveFilters,
  } = useSearch();

  const filters = useMemo(() => {
    const f: Record<string, any> = {};
    if (category) f.category = category;
    if (location.trim()) f.location = location.trim();
    if (guests) f.guests = guests;
    if (minPrice !== null) f.min_price = minPrice;
    if (maxPrice !== null) f.max_price = maxPrice;
    return f;
  }, [category, location, guests, minPrice, maxPrice]);

  const { data: listings = [], isLoading, isError } = useListings(filters);

  return (
    <>
      <CategoryBar selected={category} onSelect={setCategory} />

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <Filter size={14} />
            Active filters:
          </span>

          {location.trim() && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <MapPin size={12} className="text-[#FF385C]" />
              Location: "{location}"
            </span>
          )}

          {checkIn && checkOut && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Dates: {checkIn} → {checkOut}
            </span>
          )}

          {(minPrice !== null || maxPrice !== null) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Price: ${minPrice ?? 0} - {maxPrice !== null ? `$${maxPrice}` : "Any"}
            </span>
          )}

          {guests && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <Users size={12} className="text-[#FF385C]" />
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          )}

          {category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Category: {category}
            </span>
          )}

          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors cursor-pointer ml-auto sm:ml-2"
          >
            <X size={13} />
            Clear all filters
          </button>
        </div>
      )}

      <main className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <ListingGrid
          listings={listings}
          isLoading={isLoading}
          isError={isError}
          category={category}
        />
      </main>
    </>
  );
}
