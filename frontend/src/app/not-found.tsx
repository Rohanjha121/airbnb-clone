"use client";

import Link from "next/link";
import { Compass, Home, Heart, Luggage, ArrowLeft, MapPinOff } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Animated 404 Icon Illustration */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#FF385C]/15 dark:bg-[#FF385C]/20 blur-xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-rose-50 dark:bg-rose-950/60 text-[#FF385C] flex items-center justify-center shadow-xs border border-rose-100 dark:border-rose-900/40">
              <MapPinOff size={44} className="animate-bounce" />
            </div>
          </div>

          {/* Headline & Description */}
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-[#FF385C]">
              Error 404
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              We can't seem to find the page you're looking for.
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              The link you followed may be broken, or the page may have been moved or deleted.
            </p>
          </div>

          {/* Quick Helpful Navigation Links */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Here are some helpful links instead
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Home size={15} />
                <span>Explore Homes</span>
              </Link>
              <Link
                href="/favorites"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Heart size={15} className="text-[#FF385C]" />
                <span>Saved Wishlist</span>
              </Link>
              <Link
                href="/trips"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Luggage size={15} />
                <span>My Trips</span>
              </Link>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF385C] via-[#E61E4D] to-[#D70466] text-white rounded-2xl text-sm font-bold hover:opacity-95 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <Compass size={18} />
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
