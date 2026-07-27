"use client";

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";

interface SearchContextType {
  location: string;
  guests: number | null;
  category: string | null;
  checkIn: string;
  checkOut: string;
  minPrice: number | null;
  maxPrice: number | null;
  setLocation: (location: string) => void;
  setGuests: (guests: number | null) => void;
  setCategory: (category: string | null) => void;
  setCheckIn: (checkIn: string) => void;
  setCheckOut: (checkOut: string) => void;
  setMinPrice: (minPrice: number | null) => void;
  setMaxPrice: (maxPrice: number | null) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      location.trim() ||
        guests !== null ||
        category !== null ||
        checkIn.trim() ||
        checkOut.trim() ||
        minPrice !== null ||
        maxPrice !== null
    );
  }, [location, guests, category, checkIn, checkOut, minPrice, maxPrice]);

  const clearFilters = () => {
    setLocation("");
    setGuests(null);
    setCategory(null);
    setCheckIn("");
    setCheckOut("");
    setMinPrice(null);
    setMaxPrice(null);
  };

  return (
    <SearchContext.Provider
      value={{
        location,
        guests,
        category,
        checkIn,
        checkOut,
        minPrice,
        maxPrice,
        setLocation,
        setGuests,
        setCategory,
        setCheckIn,
        setCheckOut,
        setMinPrice,
        setMaxPrice,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
