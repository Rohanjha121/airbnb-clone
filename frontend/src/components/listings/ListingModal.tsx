"use client";

import { X } from "lucide-react";
import type { Listing } from "@/types/listing";
import ListingForm, { type ListingFormData } from "./ListingForm";

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Listing | null;
  onSubmit: (data: ListingFormData) => Promise<void> | void;
  isLoading?: boolean;
  title?: string;
}

export default function ListingModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
  title,
}: ListingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {title || (initialData ? "Edit Property Listing" : "Add New Property")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          <ListingForm
            initialData={initialData}
            onSubmit={onSubmit}
            isLoading={isLoading}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
