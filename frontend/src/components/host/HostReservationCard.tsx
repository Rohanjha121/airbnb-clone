"use client";

import ImageWithFallback from "@/components/common/ImageWithFallback";
import { Calendar, MapPin, Trash2, User } from "lucide-react";
import type { Reservation } from "@/types/reservation";

interface HostReservationCardProps {
  reservation: Reservation;
  onCancel: (id: string, listingTitle?: string) => void;
  isCancelling?: boolean;
}

export default function HostReservationCard({
  reservation,
  onCancel,
  isCancelling = false,
}: HostReservationCardProps) {
  const listing = reservation.listing;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col md:flex-row gap-6 shadow-xs hover:shadow-md transition-shadow justify-between">
      <div className="flex flex-col sm:flex-row gap-5 flex-1">
        {/* Listing Thumbnail */}
        <div className="relative w-full sm:w-48 aspect-4/3 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
          <ImageWithFallback
            src={listing?.image_url}
            alt={listing?.title || "Property"}
            fill
            sizes="200px"
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Details */}
        <div className="space-y-3 flex-1">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              Confirmed Booking
            </span>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{listing?.title || "Property Booking"}</h3>
            {listing && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                <MapPin size={13} className="text-zinc-400" />
                {listing.location_city}, {listing.location_country}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar size={15} className="text-zinc-500 dark:text-zinc-400" />
              <span>
                {reservation.check_in} → {reservation.check_out}
              </span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <div className="flex items-center gap-1.5 font-medium">
              <User size={14} className="text-zinc-500 dark:text-zinc-400" />
              <span>
                {reservation.guests} {reservation.guests === 1 ? "guest" : "guests"}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Booked on {new Date(reservation.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Host Payout & Cancellation */}
      <div className="flex md:flex-col justify-between items-end md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100 dark:border-zinc-800 shrink-0 gap-4">
        <div className="text-right">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Host Payout</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end">
            ${reservation.total_price.toFixed(0)}
          </p>
        </div>

        <button
          onClick={() => onCancel(reservation.id, listing?.title)}
          disabled={isCancelling}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Trash2 size={14} />
          Cancel Booking
        </button>
      </div>
    </div>
  );
}
