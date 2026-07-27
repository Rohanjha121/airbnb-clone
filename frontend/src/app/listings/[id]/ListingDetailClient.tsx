"use client";

import Link from "next/link";
import { ArrowLeft, WifiOff } from "lucide-react";
import { useListing } from "@/hooks/useListing";
import ListingDetail from "@/components/listings/ListingDetail";

interface ListingDetailClientProps {
  id: string;
}

export default function ListingDetailClient({ id }: ListingDetailClientProps) {
  const { data: listing, isLoading, isError } = useListing(id);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-pulse">
        {/* Top bar skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-32"></div>
          <div className="flex gap-3">
            <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-24"></div>
            <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-24"></div>
          </div>
        </div>

        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-2/3"></div>
          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/3"></div>
        </div>

        {/* 5-image hero gallery grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/9] max-h-[500px] bg-zinc-200 dark:bg-zinc-800">
          <div className="md:col-span-2 h-full bg-zinc-300 dark:bg-zinc-700"></div>
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
            <div className="bg-zinc-300 dark:bg-zinc-700 h-full"></div>
            <div className="bg-zinc-300 dark:bg-zinc-700 h-full"></div>
            <div className="bg-zinc-300 dark:bg-zinc-700 h-full"></div>
            <div className="bg-zinc-300 dark:bg-zinc-700 h-full"></div>
          </div>
        </div>

        {/* Main 2-column layout skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-2">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-1/2"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/3"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
              <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/4"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-5/6"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-4/6"></div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-3xl border border-zinc-300 dark:border-zinc-700 p-6 space-y-4">
              <div className="h-8 bg-zinc-300 dark:bg-zinc-700 rounded-xl w-1/3"></div>
              <div className="h-24 bg-zinc-300 dark:bg-zinc-700 rounded-2xl"></div>
              <div className="h-12 bg-zinc-300 dark:bg-zinc-700 rounded-2xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="bg-red-50 dark:bg-red-950/60 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <WifiOff size={32} className="text-red-500 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Listing Not Found</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          The requested property listing could not be found or may have been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Homepage
        </Link>
      </div>
    );
  }

  return <ListingDetail listing={listing} />;
}
