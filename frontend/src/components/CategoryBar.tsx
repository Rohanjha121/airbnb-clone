"use client";

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

export default function CategoryBar({ selected, onSelect }: CategoryBarProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-16 md:top-20 z-40 transition-colors">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-10">
        <div
          className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* All button */}
          <button
            onClick={() => onSelect(null)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl whitespace-nowrap 
                        transition-all duration-150 min-w-fit shrink-0 group cursor-pointer
                        ${
                          selected === null
                            ? "opacity-100"
                            : "opacity-60 hover:opacity-100"
                        }`}
          >
            <span className="text-2xl">🏠</span>
            <span
              className={`text-xs font-medium pb-0.5 transition-all
                          ${
                            selected === null
                              ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 font-bold"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
            >
              All
            </span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() =>
                onSelect(selected === cat.label ? null : cat.label)
              }
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl whitespace-nowrap 
                          transition-all duration-150 min-w-fit shrink-0 cursor-pointer
                          ${
                            selected === cat.label
                              ? "opacity-100"
                              : "opacity-60 hover:opacity-100"
                          }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span
                className={`text-xs font-medium pb-0.5 transition-all
                            ${
                              selected === cat.label
                                ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 font-bold"
                                : "text-zinc-500 dark:text-zinc-400"
                            }`}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
