"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Listing } from "@/types/listing";

const CATEGORIES = [
  "Beach",
  "Mountains",
  "Countryside",
  "Pools",
  "Islands",
  "Lake",
  "Skiing",
  "Castles",
  "Caves",
  "Camping",
  "Arctic",
  "Desert",
  "Barns",
  "Lux",
] as const;

export const listingSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  location_city: z.string().min(1, "City is required"),
  location_country: z.string().min(1, "Country is required"),
  price_per_night: z.number({ message: "Price per night is required" }).gt(0, "Price per night must be greater than 0"),
  max_guests: z.number({ message: "Max guests is required" }).int().gt(0, "Max guests must be at least 1"),
  bedrooms: z.number({ message: "Bedrooms is required" }).int().min(1, "Bedrooms must be at least 1"),
  bathrooms: z.number({ message: "Bathrooms is required" }).int().min(1, "Bathrooms must be at least 1"),
  amenities: z.string(),
  image_url: z.string().url("Must be a valid URL"),
  extra_images: z.string(),
});

export type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  initialData?: Listing | null;
  onSubmit: (data: ListingFormData) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function ListingForm({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}: ListingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "Beach",
      location_city: initialData?.location_city ?? "",
      location_country: initialData?.location_country ?? "",
      price_per_night: initialData?.price_per_night ?? 150,
      max_guests: initialData?.max_guests ?? 4,
      bedrooms: initialData?.bedrooms ?? 2,
      bathrooms: initialData?.bathrooms ?? 1,
      amenities: initialData?.amenities ?? "WiFi, Air Conditioning, Kitchen",
      image_url:
        initialData?.image_url ??
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80",
      extra_images: initialData?.extra_images ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
          Property Title
        </label>
        <input
          {...register("title")}
          type="text"
          placeholder="e.g. Modern Oceanfront Villa"
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
          Category
        </label>
        <select
          {...register("category")}
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="dark:bg-zinc-800 dark:text-zinc-100">
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            City
          </label>
          <input
            {...register("location_city")}
            type="text"
            placeholder="e.g. Malibu"
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
          {errors.location_city && (
            <p className="text-xs text-red-500 mt-1">{errors.location_city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Country
          </label>
          <input
            {...register("location_country")}
            type="text"
            placeholder="e.g. United States"
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
          {errors.location_country && (
            <p className="text-xs text-red-500 mt-1">{errors.location_country.message}</p>
          )}
        </div>
      </div>

      {/* Pricing & Capacity */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Price / Night ($)
          </label>
          <input
            {...register("price_per_night", { valueAsNumber: true })}
            type="number"
            min={1}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
          {errors.price_per_night && (
            <p className="text-xs text-red-500 mt-1">{errors.price_per_night.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Max Guests
          </label>
          <input
            {...register("max_guests", { valueAsNumber: true })}
            type="number"
            min={1}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
          {errors.max_guests && (
            <p className="text-xs text-red-500 mt-1">{errors.max_guests.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Bedrooms
          </label>
          <input
            {...register("bedrooms", { valueAsNumber: true })}
            type="number"
            min={1}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
          {errors.bedrooms && (
            <p className="text-xs text-red-500 mt-1">{errors.bedrooms.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Bathrooms
          </label>
          <input
            {...register("bathrooms", { valueAsNumber: true })}
            type="number"
            min={1}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
          {errors.bathrooms && (
            <p className="text-xs text-red-500 mt-1">{errors.bathrooms.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe your space, ambiance, and unique features..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
          Hero Image URL
        </label>
        <input
          {...register("image_url")}
          type="url"
          placeholder="https://images.unsplash.com/..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
        {errors.image_url && <p className="text-xs text-red-500 mt-1">{errors.image_url.message}</p>}
      </div>

      {/* Extra Images */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
          Extra Image URLs (Optional, 1 per line)
        </label>
        <textarea
          {...register("extra_images")}
          rows={2}
          placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
          Amenities (Comma-separated)
        </label>
        <input
          {...register("amenities")}
          type="text"
          placeholder="WiFi, Pool, Beach Access, Air Conditioning"
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 rounded-lg bg-[#FF385C] text-white text-sm font-semibold hover:bg-[#E00B41] transition-colors shadow-sm disabled:opacity-50"
        >
          {isLoading ? "Saving..." : initialData ? "Update Property" : "Create Property"}
        </button>
      </div>
    </form>
  );
}
