"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Globe,
  Compass,
  Sparkles,
  Plus,
  Minus,
} from "lucide-react";
import { useSearch } from "@/context/SearchContext";

const SUGGESTED_DESTINATIONS = [
  { label: "I'm flexible", sub: "Search anywhere", value: "", icon: Compass },
  { label: "Europe", sub: "Popular destination", value: "Europe", icon: Globe },
  { label: "United States", sub: "Popular destination", value: "United States", icon: MapPin },
  { label: "Japan", sub: "Cultural journeys", value: "Japan", icon: MapPin },
  { label: "Malibu, California", sub: "Coastal getaway", value: "Malibu", icon: Sparkles },
  { label: "Aspen, Colorado", sub: "Mountain retreat", value: "Aspen", icon: Sparkles },
  { label: "France", sub: "Historic stays", value: "France", icon: Sparkles },
];

const FLEX_DATE_CHIPS = [
  "Exact dates",
  "± 1 day",
  "± 2 days",
  "± 3 days",
  "± 7 days",
  "± 14 days",
];

export default function SearchBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const whereInputRef = useRef<HTMLInputElement>(null);
  const desktopCheckInRef = useRef<HTMLInputElement>(null);
  const desktopCheckOutRef = useRef<HTMLInputElement>(null);
  const mobileCheckInRef = useRef<HTMLInputElement>(null);
  const mobileCheckOutRef = useRef<HTMLInputElement>(null);

  const handleOpenDatePicker = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    if (!inputRef.current) return;
    try {
      if (typeof inputRef.current.showPicker === "function") {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
      }
    } catch {
      inputRef.current.focus();
    }
  };

  const [activeSection, setActiveSection] = useState<"where" | "dates" | "guests" | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  // Local draft state for search bar inputs
  const [tempLocation, setTempLocation] = useState(location);
  const [tempAdults, setTempAdults] = useState<number>(guests ? Math.max(1, guests) : 1);
  const [tempChildren, setTempChildren] = useState<number>(0);
  const [tempInfants, setTempInfants] = useState<number>(0);
  const [tempPets, setTempPets] = useState<number>(0);
  const [tempCheckIn, setTempCheckIn] = useState(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState(checkOut);
  const [selectedFlexChip, setSelectedFlexChip] = useState("Exact dates");
  const [tempMinPrice, setTempMinPrice] = useState<string>(minPrice !== null ? String(minPrice) : "");
  const [tempMaxPrice, setTempMaxPrice] = useState<string>(maxPrice !== null ? String(maxPrice) : "");
  const todayStr = new Date().toISOString().split("T")[0];

  // Auto-clear checkout if check-in is set to a date later than or equal to checkout
  useEffect(() => {
    if (tempCheckIn && tempCheckOut && tempCheckOut <= tempCheckIn) {
      setTempCheckOut("");
    }
  }, [tempCheckIn, tempCheckOut]);

  const tempTotalGuests = tempAdults + tempChildren;

  const isSearchOpen = activeSection !== null || isMobileOpen;
  const prevOpenRef = useRef(false);

  // Sync draft state with SearchContext ONLY when transitioning from closed to open
  useEffect(() => {
    if (isSearchOpen && !prevOpenRef.current) {
      setTempLocation(location);
      setTempAdults(guests && guests > 0 ? guests : 1);
      setTempChildren(0);
      setTempInfants(0);
      setTempPets(0);
      setTempCheckIn(checkIn);
      setTempCheckOut(checkOut);
      setTempMinPrice(minPrice !== null ? String(minPrice) : "");
      setTempMaxPrice(maxPrice !== null ? String(maxPrice) : "");
    }
    prevOpenRef.current = isSearchOpen;
  }, [isSearchOpen, location, guests, checkIn, checkOut, minPrice, maxPrice]);

  // Focus input when 'where' section becomes active
  useEffect(() => {
    if (activeSection === "where") {
      setTimeout(() => {
        whereInputRef.current?.focus();
      }, 50);
    }
  }, [activeSection]);

  // Event listener for click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Event listener for ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveSection(null);
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent page scroll when panel/modal is active
  useEffect(() => {
    if (activeSection !== null || isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeSection, isMobileOpen]);

  const handleApplySearch = () => {
    setLocation(tempLocation);
    setGuests(tempTotalGuests > 0 ? tempTotalGuests : null);
    setCheckIn(tempCheckIn);
    setCheckOut(tempCheckOut);
    setMinPrice(tempMinPrice.trim() !== "" ? Number(tempMinPrice) : null);
    setMaxPrice(tempMaxPrice.trim() !== "" ? Number(tempMaxPrice) : null);
    setActiveSection(null);
    setIsMobileOpen(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    clearFilters();
    setTempLocation("");
    setTempAdults(1);
    setTempChildren(0);
    setTempInfants(0);
    setTempPets(0);
    setTempCheckIn("");
    setTempCheckOut("");
    setTempMinPrice("");
    setTempMaxPrice("");
  };

  const getGuestSummaryText = () => {
    if (tempTotalGuests === 0 && tempInfants === 0 && tempPets === 0) {
      return "Add guests";
    }
    const parts: string[] = [];
    if (tempTotalGuests > 0) {
      parts.push(`${tempTotalGuests} ${tempTotalGuests === 1 ? "guest" : "guests"}`);
    }
    if (tempInfants > 0) {
      parts.push(`${tempInfants} ${tempInfants === 1 ? "infant" : "infants"}`);
    }
    if (tempPets > 0) {
      parts.push(`${tempPets} ${tempPets === 1 ? "pet" : "pets"}`);
    }
    return parts.join(", ");
  };

  const handleSelectDestination = (destValue: string) => {
    setTempLocation(destValue);
    setActiveSection("dates");
  };

  const handlePresetDates = (type: "weekend" | "nextweek" | "anytime") => {
    if (type === "anytime") {
      setTempCheckIn("");
      setTempCheckOut("");
      return;
    }
    const today = new Date();
    if (type === "weekend") {
      const sat = new Date(today);
      sat.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);
      setTempCheckIn(sat.toISOString().split("T")[0]);
      setTempCheckOut(sun.toISOString().split("T")[0]);
    } else if (type === "nextweek") {
      const mon = new Date(today);
      mon.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      setTempCheckIn(mon.toISOString().split("T")[0]);
      setTempCheckOut(sun.toISOString().split("T")[0]);
    }
  };

  return (
    <>
      {/* Semi-transparent Overlay */}
      {(activeSection !== null || isMobileOpen) && (
        <div
          onClick={() => {
            setActiveSection(null);
            setIsMobileOpen(false);
          }}
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Main Search Bar Container */}
      <div ref={containerRef} className="relative z-50 w-full">
        {/* DESKTOP SEARCH BAR (MD screens and above) */}
        <div className="hidden md:block">
          <div
            className={`flex items-center justify-between border transition-all duration-200 rounded-full ${
              activeSection !== null
                ? "bg-zinc-100 dark:bg-zinc-800/90 border-zinc-300 dark:border-zinc-700 shadow-xl p-1.5"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700/80 shadow-sm hover:shadow-md py-1.5 px-2"
            }`}
          >
            {/* 1. WHERE SECTION */}
            <div
              onClick={() => setActiveSection(activeSection === "where" ? null : "where")}
              className={`flex-1 flex flex-col justify-center px-6 py-2.5 rounded-full cursor-pointer transition-all duration-200 ${
                activeSection === "where"
                  ? "bg-white dark:bg-zinc-900 shadow-md ring-1 ring-black/5"
                  : "hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60"
              }`}
            >
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Where
              </span>
              <input
                ref={whereInputRef}
                type="text"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                placeholder="Search destinations"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("where");
                }}
                className="w-full text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 bg-transparent border-none outline-none truncate p-0"
              />
            </div>

            {/* SEPARATOR */}
            <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-700 shrink-0 mx-0.5" />

            {/* 2. WHEN SECTION */}
            <div
              onClick={() => setActiveSection(activeSection === "dates" ? null : "dates")}
              className={`flex-1 flex flex-col justify-center px-6 py-2.5 rounded-full cursor-pointer transition-all duration-200 ${
                activeSection === "dates"
                  ? "bg-white dark:bg-zinc-900 shadow-md ring-1 ring-black/5"
                  : "hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60"
              }`}
            >
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                When
              </span>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 truncate">
                {tempCheckIn && tempCheckOut ? `${tempCheckIn} - ${tempCheckOut}` : "Add dates"}
              </span>
            </div>

            {/* SEPARATOR */}
            <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-700 shrink-0 mx-0.5" />

            {/* 3. WHO SECTION */}
            <div
              onClick={() => setActiveSection(activeSection === "guests" ? null : "guests")}
              className={`flex-1 flex flex-col justify-center px-6 py-2.5 rounded-full cursor-pointer transition-all duration-200 ${
                activeSection === "guests"
                  ? "bg-white dark:bg-zinc-900 shadow-md ring-1 ring-black/5"
                  : "hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60"
              }`}
            >
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Who
              </span>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 truncate">
                {getGuestSummaryText()}
              </span>
            </div>

            {/* 4. ACTIONS (SEARCH + CLEAR) */}
            <div className="flex items-center gap-1.5 pl-2 pr-1 shrink-0">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}

              <button
                type="button"
                onClick={handleApplySearch}
                className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full px-4 py-2.5 font-semibold text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <Search size={16} className="stroke-[2.5]" />
                {activeSection !== null && <span className="font-bold pr-1">Search</span>}
              </button>
            </div>
          </div>

          {/* DROPDOWN PANELS */}

          {/* WHERE PANEL */}
          {activeSection === "where" && (
            <div className="absolute top-full left-0 mt-3 w-full md:w-[480px] bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 z-50 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
                Suggested destinations
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {SUGGESTED_DESTINATIONS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDestination(item.value)}
                      className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left group cursor-pointer"
                    >
                      <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors border border-zinc-200/50 dark:border-zinc-700/50">
                        <Icon size={18} className="text-[#FF385C]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.label}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {item.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* WHEN (DATES) PANEL */}
          {activeSection === "dates" && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Select Trip Dates
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetDates("weekend")}
                    className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    This weekend
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetDates("nextweek")}
                    className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    Next week
                  </button>
                </div>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  onClick={() => handleOpenDatePicker(desktopCheckInRef)}
                  className="cursor-pointer"
                >
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 cursor-pointer">
                    Check-in
                  </label>
                  <div className="relative flex items-center cursor-pointer">
                    <Calendar size={16} className="absolute left-3 text-zinc-400 pointer-events-none" />
                    <input
                      ref={desktopCheckInRef}
                      type="date"
                      min={todayStr}
                      value={tempCheckIn}
                      onChange={(e) => setTempCheckIn(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
                    />
                  </div>
                </div>
                <div
                  onClick={() => handleOpenDatePicker(desktopCheckOutRef)}
                  className="cursor-pointer"
                >
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 cursor-pointer">
                    Checkout
                  </label>
                  <div className="relative flex items-center cursor-pointer">
                    <Calendar size={16} className="absolute left-3 text-zinc-400 pointer-events-none" />
                    <input
                      ref={desktopCheckOutRef}
                      type="date"
                      min={tempCheckIn || todayStr}
                      value={tempCheckOut}
                      onChange={(e) => setTempCheckOut(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Date Flex Chips */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
                  Flexible options
                </label>
                <div className="flex flex-wrap gap-2">
                  {FLEX_DATE_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSelectedFlexChip(chip)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        selectedFlexChip === chip
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-bold shadow-xs"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => handlePresetDates("anytime")}
                  className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 underline hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Clear dates
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("guests")}
                  className="px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Next: Who
                </button>
              </div>
            </div>
          )}

          {/* GUESTS PANEL */}
          {activeSection === "guests" && (
            <div className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-5">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Adults</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Ages 13 or above</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTempAdults(Math.max(1, tempAdults - 1))}
                      disabled={tempAdults <= 1}
                      className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {tempAdults}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTempAdults(tempAdults + 1)}
                      className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Children</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Ages 2–12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTempChildren(Math.max(0, tempChildren - 1))}
                      disabled={tempChildren <= 0}
                      className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {tempChildren}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTempChildren(tempChildren + 1)}
                      className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Infants</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Under 2</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTempInfants(Math.max(0, tempInfants - 1))}
                      disabled={tempInfants <= 0}
                      className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {tempInfants}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTempInfants(tempInfants + 1)}
                      className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Pets</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Bringing a service animal?</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTempPets(Math.max(0, tempPets - 1))}
                      disabled={tempPets <= 0}
                      className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {tempPets}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTempPets(tempPets + 1)}
                      className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Guests Panel Footer */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setTempAdults(1);
                    setTempChildren(0);
                    setTempInfants(0);
                    setTempPets(0);
                  }}
                  className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 underline hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Clear guests
                </button>
                <button
                  type="button"
                  onClick={handleApplySearch}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  <Search size={15} />
                  Search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE COMPACT SEARCH BUTTON (< MD screens) */}
        <div className="block md:hidden w-full">
          <div className="flex items-center justify-between gap-2 w-full">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex items-center justify-between gap-3 border border-zinc-200 dark:border-zinc-700/80 rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-200 cursor-pointer w-full"
            >
              <div className="flex items-center gap-3 truncate">
                <Search size={16} className="text-[#FF385C] shrink-0" />
                <div className="flex flex-col text-left truncate">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {location.trim() ? location : "Anywhere"}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {checkIn && checkOut ? `${checkIn} • ${checkOut}` : "Any week"} •{" "}
                    {guests ? `${guests} guests` : "Add guests"}
                  </span>
                </div>
              </div>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="p-2.5 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
                title="Clear filters"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* MOBILE MODAL DIALOG */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Search Places & Stays
                </h2>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
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

                {/* Trip Dates */}
                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Calendar size={15} className="text-[#FF385C]" />
                    Trip Dates
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => handleOpenDatePicker(mobileCheckInRef)}
                      className="cursor-pointer"
                    >
                      <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1 cursor-pointer">
                        Check-in
                      </label>
                      <input
                        ref={mobileCheckInRef}
                        type="date"
                        min={todayStr}
                        value={tempCheckIn}
                        onChange={(e) => setTempCheckIn(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
                      />
                    </div>
                    <div
                      onClick={() => handleOpenDatePicker(mobileCheckOutRef)}
                      className="cursor-pointer"
                    >
                      <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1 cursor-pointer">
                        Checkout
                      </label>
                      <input
                        ref={mobileCheckOutRef}
                        type="date"
                        min={tempCheckIn || todayStr}
                        value={tempCheckOut}
                        onChange={(e) => setTempCheckOut(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Range */}
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
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Ages 13 or above
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTempAdults(Math.max(1, tempAdults - 1))}
                      disabled={tempAdults <= 1}
                      className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {tempAdults}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTempAdults(tempAdults + 1)}
                      className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 cursor-pointer"
                    >
                      <Plus size={14} />
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
      </div>
    </>
  );
}
