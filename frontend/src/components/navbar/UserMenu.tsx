"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Menu, Building, Luggage, Home, Calendar, Plus, Heart } from "lucide-react";
import RentYourHomeModal from "@/components/host/RentYourHomeModal";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [isHost, setIsHost] = useState(true); // Default to host user mode (Sarah Mitchell)

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div ref={menuRef} className="relative flex items-center shrink-0 whitespace-nowrap">

        {/* User pill menu button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="User account menu"
          className="flex items-center gap-3 border border-zinc-300 dark:border-zinc-700 rounded-full px-3 py-1.5 
                     hover:shadow-md transition duration-200 bg-white dark:bg-zinc-900 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
        >
          <Menu size={16} className="text-zinc-700 dark:text-zinc-300" />
          <div className="bg-zinc-700 dark:bg-zinc-600 rounded-full p-1 text-white">
            <User size={16} />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute right-0 top-12 w-64 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            onClick={() => setIsOpen(false)}
          >
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <Home size={15} className="text-zinc-500 dark:text-zinc-400" />
              Explore Homes
            </Link>

            <Link
              href="/favorites"
              className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <Heart size={15} className="text-[#FF385C]" />
              Favorites
            </Link>

            <Link
              href="/trips"
              className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <Luggage size={15} className="text-zinc-500 dark:text-zinc-400" />
              My Trips
            </Link>

            {/* Host Options */}
            {isHost && (
              <>
                <div className="my-1 border-t border-zinc-100 dark:border-zinc-800"></div>
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF385C]">
                  Host Management
                </div>

                <button
                  type="button"
                  onClick={() => setIsRentModalOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer text-left"
                >
                  <Plus size={15} className="text-[#FF385C]" />
                  Rent your home
                </button>

                <Link
                  href="/my-properties"
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <Building size={15} className="text-zinc-500 dark:text-zinc-400" />
                  My Properties
                </Link>

                <Link
                  href="/reservations"
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <Calendar size={15} className="text-zinc-500 dark:text-zinc-400" />
                  My Reservations
                </Link>
              </>
            )}

            <div className="my-1.5 border-t border-zinc-100 dark:border-zinc-800"></div>

            {/* Theme Switcher Controls */}
            <ThemeToggle />

            <div className="my-1.5 border-t border-zinc-100 dark:border-zinc-800"></div>

            {/* Toggle Host Mode */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsHost(!isHost);
              }}
              className="w-full px-4 py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 flex items-center justify-between cursor-pointer"
            >
              <span>Host Mode</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isHost ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                {isHost ? "Active" : "Guest Mode"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Rent Your Home Modal */}
      <RentYourHomeModal
        isOpen={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
      />
    </>
  );
}
