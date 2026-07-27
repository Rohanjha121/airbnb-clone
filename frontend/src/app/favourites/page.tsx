"use client";

import Link from "next/link";
import { Heart, Compass } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import ListingCard from "@/components/listings/ListingCard";
import ListingCardSkeleton from "@/components/listings/ListingCardSkeleton";
import { useFavourites } from "@/hooks/useFavourites";

export default function FavouritesPage() {
  const { data: favourites = [], isLoading, isError } = useFavourites();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/60 text-[#FF385C] flex items-center justify-center">
                <Heart size={18} className="fill-[#FF385C]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Your Wishlist
              </h1>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Your saved dream homes, beach villas, and cozy cabins in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Compass size={16} />
              Explore Homes
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Failed to load wishlist</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              There was an issue retrieving your saved properties. Please try refreshing.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && favourites.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 sm:p-16 text-center space-y-5 max-w-lg mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/60 text-[#FF385C] flex items-center justify-center mx-auto shadow-xs">
              <Heart size={40} className="fill-[#FF385C]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">Your wishlist is empty</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                As you search, tap the heart icon on any property to save your favorite stays here.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF385C] via-[#E61E4D] to-[#D70466] text-white rounded-xl text-sm font-bold hover:opacity-95 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Compass size={18} />
              Start Exploring Homes
            </Link>
          </div>
        )}

        {/* Favourites Grid */}
        {!isLoading && !isError && favourites.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {favourites.length} {favourites.length === 1 ? "Property" : "Properties"} Saved
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favourites.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
