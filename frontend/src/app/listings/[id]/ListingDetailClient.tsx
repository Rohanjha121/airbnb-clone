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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
        <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
            <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
          <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
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
