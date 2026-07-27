"use client";

import { memo } from "react";
import { type ListingCategory } from "@/types/listing";

interface Category {
  label: ListingCategory;
  icon: string;
}

const CATEGORIES: Category[] = [
  { label: "Beach", icon: "🏖️" },
  { label: "Mountains", icon: "⛰️" },
  { label: "Countryside", icon: "🌿" },
  { label: "Pools", icon: "🏊" },
  { label: "Islands", icon: "🏝️" },
  { label: "Lake", icon: "🏞️" },
  { label: "Skiing", icon: "⛷️" },
  { label: "Castles", icon: "🏰" },
  { label: "Caves", icon: "🪨" },
  { label: "Camping", icon: "⛺" },
  { label: "Arctic", icon: "🧊" },
  { label: "Desert", icon: "🌵" },
  { label: "Barns", icon: "🏚️" },
  { label: "Lux", icon: "💎" },
];

interface CategoryBarProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

function CategoryBarComponent({ selected, onSelect }: CategoryBarProps) {
  return (
    <nav
      aria-label="Property categories"
      className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-16 md:top-20 z-40 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          role="tablist"
          aria-label="Filter listings by category"
          className="flex items-center justify-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide py-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* All button */}
          <button
            role="tab"
            aria-selected={selected === null}
            aria-label="All categories"
            onClick={() => onSelect(null)}
            className="flex flex-col items-center justify-center min-w-[72px] flex-shrink-0 cursor-pointer gap-1 px-3 py-2 rounded-xl whitespace-nowrap opacity-100 group transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
          >
            <span className="text-2xl shrink-0 select-none" aria-hidden="true">🏠</span>
            <span
              className={`text-xs font-medium pb-0.5 transition-colors duration-150
                          ${
                            selected === null
                              ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 font-bold"
                              : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                          }`}
            >
              All
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selected === cat.label;
            return (
              <button
                key={cat.label}
                role="tab"
                aria-selected={isSelected}
                aria-label={`Filter by ${cat.label}`}
                onClick={() =>
                  onSelect(isSelected ? null : cat.label)
                }
                className="flex flex-col items-center justify-center min-w-[72px] flex-shrink-0 cursor-pointer gap-1 px-3 py-2 rounded-xl whitespace-nowrap opacity-100 group transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
              >
                <span className="text-2xl shrink-0 select-none" aria-hidden="true">{cat.icon}</span>
                <span
                  className={`text-xs font-medium pb-0.5 transition-colors duration-150
                              ${
                                isSelected
                                  ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 font-bold"
                                  : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                              }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

const CategoryBar = memo(CategoryBarComponent);
export default CategoryBar;
