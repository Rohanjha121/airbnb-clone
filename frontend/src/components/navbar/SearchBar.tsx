"use client";

import { toast } from "react-hot-toast";
import { useState } from "react";
import { Search, X, MapPin, Users, Calendar, DollarSign } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    location,
    guests,
    checkIn,
    checkOut,
    minPrice,
    maxPrice,
    setLocation,
    setGuests,
    setCheckIn,
    setCheckOut,
    setMinPrice,
    setMaxPrice,
    clearFilters,
    hasActiveFilters,
  } = useSearch();

  // Local draft state for modal
  const [tempLocation, setTempLocation] = useState(location);
  const [tempGuests, setTempGuests] = useState<number>(guests ?? 1);
  const [tempCheckIn, setTempCheckIn] = useState(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState(checkOut);
  const [tempMinPrice, setTempMinPrice] = useState<string>(minPrice !== null ? String(minPrice) : "");
  const [tempMaxPrice, setTempMaxPrice] = useState<string>(maxPrice !== null ? String(maxPrice) : "");

  const handleOpenModal = () => {
    setTempLocation(location);
    setTempGuests(guests ?? 1);
    setTempCheckIn(checkIn);
    setTempCheckOut(checkOut);
    setTempMinPrice(minPrice !== null ? String(minPrice) : "");
    setTempMaxPrice(maxPrice !== null ? String(maxPrice) : "");
    setIsOpen(true);
  };

  const handleApplySearch = () => {
    setLocation(tempLocation);
    setGuests(tempGuests > 0 ? tempGuests : null);
    setCheckIn(tempCheckIn);
    setCheckOut(tempCheckOut);
    setMinPrice(tempMinPrice.trim() !== "" ? Number(tempMinPrice) : null);
    setMaxPrice(tempMaxPrice.trim() !== "" ? Number(tempMaxPrice) : null);
    setIsOpen(false);

    const hasSearchCriteria = tempLocation.trim() || tempCheckIn || tempMinPrice || tempMaxPrice || tempGuests > 1;
    if (hasSearchCriteria) {
      toast.success(tempLocation.trim() ? `Searching stays in "${tempLocation}"` : "Search filters applied");
    }
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    clearFilters();
    setTempLocation("");
    setTempGuests(1);
    setTempCheckIn("");
    setTempCheckOut("");
    setTempMinPrice("");
    setTempMaxPrice("");
    toast.success("Search filters cleared");
  };

  return (
    <>
      {/* Pill Search Button */}
      <div className="flex items-center justify-center gap-2 w-full">
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-between gap-3 sm:gap-4 border border-zinc-200 dark:border-zinc-700/80 rounded-full 
                     px-4 sm:px-5 py-2 sm:py-2.5 shadow-xs hover:shadow-md transition-all duration-200 
                     bg-white dark:bg-zinc-900 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 cursor-pointer w-full"
          aria-label="Search destinations"
        >
          <span className="border-r border-zinc-200 dark:border-zinc-700 pr-3 sm:pr-4 truncate max-w-[100px] sm:max-w-[130px] font-semibold text-zinc-900 dark:text-zinc-100">
            {location.trim() ? location : "Anywhere"}
          </span>

          <span className="border-r border-zinc-200 dark:border-zinc-700 pr-3 sm:pr-4 text-zinc-500 dark:text-zinc-400 hidden md:inline">
            {checkIn && checkOut ? `${checkIn} - ${checkOut}` : "Any week"}
          </span>

          <span className="text-zinc-500 dark:text-zinc-400 pr-1 sm:pr-2 shrink-0">
            {guests ? `${guests} ${guests === 1 ? "guest" : "guests"}` : "Add guests"}
          </span>

          <div className="bg-[#FF385C] text-white rounded-full p-1.5 shrink-0 hover:bg-[#E00B41] transition-colors">
            <Search size={14} />
          </div>
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
            title="Clear search filters"
          >
            <X size={16} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Airbnb Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Search Places & Stays</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Location Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <MapPin size={15} className="text-[#FF385C]" />
                  Where to?
                </label>
                <input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  placeholder="Search destinations (e.g. Malibu, France, Aspen)"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  autoFocus
                />
              </div>

              {/* Check-in & Check-out Dates */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Calendar size={15} className="text-[#FF385C]" />
                  Trip Dates
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={tempCheckIn}
                      onChange={(e) => setTempCheckIn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                      Checkout
                    </label>
                    <input
                      type="date"
                      value={tempCheckOut}
                      onChange={(e) => setTempCheckOut(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <DollarSign size={15} className="text-[#FF385C]" />
                  Nightly Price Range ($)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      min={0}
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                      placeholder="Min price"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min={0}
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                      placeholder="Max price"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Counter */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Users size={15} className="text-[#FF385C]" />
                    Guests
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTempGuests(Math.max(1, tempGuests - 1))}
                    disabled={tempGuests <= 1}
                    className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {tempGuests}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTempGuests(tempGuests + 1)}
                    className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 dark:bg-zinc-800/60 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 underline hover:text-black dark:hover:text-white cursor-pointer"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={handleApplySearch}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF385C] text-white font-semibold text-sm rounded-xl hover:bg-[#E00B41] transition-colors shadow-sm cursor-pointer"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
