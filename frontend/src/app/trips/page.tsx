"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Calendar, MapPin, Trash2, Luggage, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { useReservations, useCancelReservation } from "@/hooks/useReservations";

const MOCK_GUEST_ID = "guest-user-002";

function getErrorMessage(err: any, fallback = "Something went wrong"): string {
  const detail = err?.response?.data?.detail;
  if (!detail) return err?.message || fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const firstErr = detail[0];
    if (typeof firstErr === "string") return firstErr;
    if (firstErr && typeof firstErr.msg === "string") return firstErr.msg;
    if (firstErr && typeof firstErr.message === "string") return firstErr.message;
  }
  return fallback;
}

export default function MyTripsPage() {
  const { data: reservations = [], isLoading } = useReservations({ guest_id: MOCK_GUEST_ID });
  const cancelMutation = useCancelReservation();

  const handleCancelReservation = async (id: string, title?: string) => {
    if (!confirm(`Are you sure you want to cancel your reservation for "${title || "this trip"}"?`)) {
      return;
    }

    try {
      await cancelMutation.mutateAsync(id);
      toast.success("Reservation cancelled successfully!");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to cancel reservation"));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">My Trips</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              View and manage your upcoming accommodation bookings.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shrink-0"
          >
            <ArrowLeft size={16} />
            Explore Properties
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-6 animate-pulse justify-between">
                <div className="flex flex-col sm:flex-row gap-5 flex-1">
                  <div className="w-full sm:w-48 aspect-4/3 bg-zinc-200 dark:bg-zinc-800 rounded-xl shrink-0"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-2/3"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3"></div>
                    <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
                  </div>
                </div>
                <div className="flex md:flex-col justify-between items-end gap-4 shrink-0">
                  <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-md w-20"></div>
                  <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-28"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && reservations.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 sm:p-16 text-center space-y-5 max-w-lg mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/60 text-[#FF385C] flex items-center justify-center mx-auto shadow-xs">
              <Luggage size={38} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">No trips booked yet</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Time to dust off your bags and start planning your next getaway. Discover unique stays around the world.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF385C] via-[#E61E4D] to-[#D70466] text-white rounded-xl text-sm font-bold hover:opacity-95 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Start Searching Homes
            </Link>
          </div>
        )}

        {/* Trips List */}
        {!isLoading && reservations.length > 0 && (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 flex flex-col md:flex-row gap-6 shadow-xs hover:shadow-md transition-shadow justify-between"
              >
                <div className="flex flex-col sm:flex-row gap-5 flex-1">
                  {/* Property Image */}
                  <div className="relative w-full sm:w-48 aspect-4/3 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    <ImageWithFallback
                      src={res.listing?.image_url}
                      alt={res.listing?.title || "Reserved Property"}
                      fill
                      sizes="200px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Trip Info */}
                  <div className="space-y-2.5 flex-1">
                    <div>
                      <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                        {res.listing?.title || "Property Reservation"}
                      </h3>
                      {res.listing && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={13} className="text-zinc-400" />
                          {res.listing.location_city}, {res.listing.location_country}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={15} className="text-zinc-500 dark:text-zinc-400" />
                        <span>Check-in: <strong>{res.check_in}</strong></span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={15} className="text-zinc-500 dark:text-zinc-400" />
                        <span>Checkout: <strong>{res.check_out}</strong></span>
                      </div>
                      <span className="text-zinc-300 dark:text-zinc-700">|</span>
                      <span>{res.guests} {res.guests === 1 ? "guest" : "guests"}</span>
                    </div>

                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Booked on {new Date(res.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Price & Cancellation */}
                <div className="flex md:flex-col justify-between items-end md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100 dark:border-zinc-800 shrink-0 gap-4">
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Total Paid</span>
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">${res.total_price.toFixed(0)}</p>
                  </div>

                  <button
                    onClick={() => handleCancelReservation(res.id, res.listing?.title)}
                    disabled={cancelMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Cancel Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
