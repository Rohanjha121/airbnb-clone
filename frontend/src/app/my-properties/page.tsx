"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Plus, Edit2, Trash2, Home, Luggage, Building } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import {
  useListings,
  useCreateListing,
  useUpdateListing,
  useDeleteListing,
} from "@/hooks/useListings";
import ListingModal from "@/components/listings/ListingModal";
import RentYourHomeModal from "@/components/host/RentYourHomeModal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import type { Listing } from "@/types/listing";
import type { ListingFormData } from "@/components/listings/ListingForm";

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

export default function MyPropertiesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string | undefined>(undefined);

  const { data: listings = [], isLoading } = useListings({ host_id: MOCK_HOST_ID });

  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing();
  const deleteMutation = useDeleteListing();

  const handleOpenCreateModal = () => {
    setSelectedListing(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (listing: Listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (data: ListingFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("New property created successfully!");
      setIsCreateModalOpen(false);
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to create property"));
    }
  };

  const handleEditSubmit = async (data: ListingFormData) => {
    if (!selectedListing) return;
    try {
      await updateMutation.mutateAsync({ id: selectedListing.id, data });
      toast.success("Property updated successfully!");
      setIsEditModalOpen(false);
      setSelectedListing(null);
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to update property"));
    }
  };

  const handleOpenDeleteModal = (listingId: string, title: string) => {
    setDeleteId(listingId);
    setDeleteTitle(title);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Property deleted successfully!");
      setDeleteId(null);
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to delete property"));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">My Properties</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage your property portfolio, edit details, or list new homes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/reservations"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Luggage size={16} />
              Host Reservations
            </Link>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF385C] text-white font-semibold text-sm rounded-xl hover:bg-[#E00B41] transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus size={18} />
              Rent Your Home
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 space-y-3 animate-pulse">
                <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full"></div>
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && listings.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-zinc-400">
              <Home size={32} />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">No properties listed yet</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Start hosting today by adding your first property listing.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF385C] text-white rounded-xl text-sm font-semibold hover:bg-[#E00B41] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              Rent Your Home
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!isLoading && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800">
                    <ImageWithFallback
                      src={listing.image_url}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-xs">
                      {listing.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-base truncate">
                        {listing.title}
                      </p>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {listing.location_city}, {listing.location_country} • {listing.max_guests} guests
                    </p>

                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-1">
                      ${listing.price_per_night.toFixed(0)}{" "}
                      <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">/ night</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white underline"
                  >
                    View Details
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(listing)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(listing.id, listing.title)}
                      disabled={deleteMutation.isPending}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Rent Your Home Modal (Create) */}
      <RentYourHomeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Listing Modal */}
      <ListingModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedListing(null);
        }}
        initialData={selectedListing}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
        title="Edit Listing Details"
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteId)}
        title="Delete Listing"
        message={`Are you sure you want to delete "${deleteTitle || "this property"}"? This action cannot be undone.`}
        confirmLabel="Delete Property"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}

