"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Calendar, DollarSign, ArrowLeft, Luggage, Building } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import HostReservationCard from "@/components/host/HostReservationCard";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { useHostReservations, useCancelReservation } from "@/hooks/useReservations";

const MOCK_HOST_ID = "host-user-001";

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

export default function MyReservationsPage() {
  const { data: reservations = [], isLoading } = useHostReservations(MOCK_HOST_ID);
  const cancelMutation = useCancelReservation();

  const [selectedResId, setSelectedResId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>(undefined);

  const handleOpenCancelModal = (id: string, title?: string) => {
    setSelectedResId(id);
    setSelectedTitle(title);
  };

  const handleConfirmCancel = async () => {
    if (!selectedResId) return;
    try {
      await cancelMutation.mutateAsync(selectedResId);
      toast.success("Guest reservation cancelled successfully!");
      setSelectedResId(null);
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to cancel reservation"));
    }
  };

  // Compute total host earnings from confirmed reservations
  const totalPayout = reservations.reduce((acc, r) => acc + (r.total_price || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Host Reservations</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage incoming guest bookings and track earnings across your properties.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/my-properties"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Building size={16} />
              My Properties
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              <ArrowLeft size={16} />
              Home
            </Link>
          </div>
        </div>

        {/* Host Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign size={24} />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Total Projected Payout
              </span>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">${totalPayout.toFixed(0)}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Calendar size={24} />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Active Bookings
              </span>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{reservations.length}</p>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-6 animate-pulse justify-between">
                <div className="flex flex-col sm:flex-row gap-5 flex-1">
                  <div className="w-full sm:w-48 aspect-4/3 bg-zinc-200 dark:bg-zinc-800 rounded-xl shrink-0"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-2/3"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3"></div>
                    <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
                  </div>
                </div>
                <div className="flex md:flex-col justify-between items-end gap-4 shrink-0">
                  <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-md w-24"></div>
                  <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-32"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && reservations.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 sm:p-16 text-center space-y-5 max-w-lg mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto shadow-xs">
              <Calendar size={38} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">No incoming guest reservations yet</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                When guests book your listed properties, their reservation details and payout will appear here.
              </p>
            </div>
            <Link
              href="/my-properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md active:scale-95 cursor-pointer"
            >
              <Building size={18} />
              Manage Properties
            </Link>
          </div>
        )}

        {/* Reservations List */}
        {!isLoading && reservations.length > 0 && (
          <div className="space-y-4">
            {reservations.map((res) => (
              <HostReservationCard
                key={res.id}
                reservation={res}
                onCancel={handleOpenCancelModal}
                isCancelling={cancelMutation.isPending && selectedResId === res.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(selectedResId)}
        title="Cancel Guest Booking"
        message={`Are you sure you want to cancel the reservation for "${selectedTitle || "this property"}"?`}
        confirmLabel="Cancel Booking"
        isLoading={cancelMutation.isPending}
        onConfirm={handleConfirmCancel}
        onClose={() => setSelectedResId(null)}
      />
    </div>
  );
}
