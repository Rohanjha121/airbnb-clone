"use client";

import { Heart } from "lucide-react";
import { useFavouriteIds, useToggleFavourite } from "@/hooks/useFavourites";

interface HeartButtonProps {
  listingId: string;
  className?: string;
  size?: number;
  showLabel?: boolean;
}

export default function HeartButton({
  listingId,
  className = "",
  size = 24,
  showLabel = false,
}: HeartButtonProps) {
  const { data: favouriteIds = [] } = useFavouriteIds();
  const toggleFavouriteMutation = useToggleFavourite();

  const isFavourited = favouriteIds.includes(listingId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavouriteMutation.mutate(listingId);
  };

  if (showLabel) {
    return (
      <button
        onClick={handleClick}
        disabled={toggleFavouriteMutation.isPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-70 ${className}`}
        aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
      >
        <Heart
          size={size}
          className={`transition-colors ${
            isFavourited ? "fill-[#FF385C] stroke-[#FF385C]" : "stroke-zinc-800 dark:stroke-zinc-200"
          }`}
        />
        <span>{isFavourited ? "Saved" : "Save"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={toggleFavouriteMutation.isPending}
      aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
      className={`p-1.5 rounded-full transition-transform hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-70 ${className}`}
    >
      <Heart
        size={size}
        className={`drop-shadow-md transition-colors ${
          isFavourited
            ? "fill-[#FF385C] stroke-[#FF385C]"
            : "fill-black/30 stroke-white"
        }`}
      />
    </button>
  );
}
