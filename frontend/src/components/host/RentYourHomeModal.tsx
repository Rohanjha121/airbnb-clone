"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { X, ArrowLeft, ArrowRight, CheckCircle2, MapPin, DollarSign, Home, Image as ImageIcon, Sparkles } from "lucide-react";
import { listingSchema, type ListingFormData } from "@/components/listings/ListingForm";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { useCreateListing } from "@/hooks/useListings";

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

interface RentYourHomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

enum STEPS {
  CATEGORY = 1,
  LOCATION = 2,
  DETAILS = 3,
  PRICE = 4,
  PHOTOS = 5,
  REVIEW = 6,
}

export default function RentYourHomeModal({ isOpen, onClose }: RentYourHomeModalProps) {
  const [step, setStep] = useState<STEPS>(STEPS.CATEGORY);
  const createListingMutation = useCreateListing();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Beach",
      location_city: "",
      location_country: "",
      price_per_night: 150,
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: "WiFi, Air Conditioning, Kitchen",
      image_url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80",
      extra_images: "",
    },
  });

  const selectedCategory = watch("category");
  const formValues = watch();

  if (!isOpen) return null;

  const handleNext = async () => {
    let isValid = false;

    if (step === STEPS.CATEGORY) {
      isValid = await trigger("category");
    } else if (step === STEPS.LOCATION) {
      isValid = await trigger(["location_city", "location_country"]);
    } else if (step === STEPS.DETAILS) {
      isValid = await trigger(["title", "description", "max_guests", "bedrooms", "bathrooms", "amenities"]);
    } else if (step === STEPS.PRICE) {
      isValid = await trigger("price_per_night");
    } else if (step === STEPS.PHOTOS) {
      isValid = await trigger(["image_url", "extra_images"]);
    }

    if (isValid) {
      setStep((prev) => Math.min(STEPS.REVIEW, prev + 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(STEPS.CATEGORY, prev - 1));
  };

  const handleFormSubmit = async (data: ListingFormData) => {
    try {
      await createListingMutation.mutateAsync(data);
      toast.success("Property listed successfully!");
      reset();
      setStep(STEPS.CATEGORY);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create listing");
    }
  };

  const progressPercentage = (step / 6) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF385C]">
              Step {step} of 6
            </span>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {step === STEPS.CATEGORY && "Which of these best describes your place?"}
              {step === STEPS.LOCATION && "Where is your property located?"}
              {step === STEPS.DETAILS && "Share some basic details about your place"}
              {step === STEPS.PRICE && "Set your nightly price"}
              {step === STEPS.PHOTOS && "Add photos of your property"}
              {step === STEPS.REVIEW && "Review and confirm your property details"}
            </h2>
          </div>
          <button
            onClick={() => {
              setStep(STEPS.CATEGORY);
              onClose();
            }}
            className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 shrink-0">
          <div
            className="bg-[#FF385C] h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* STEP 1: CATEGORY */}
            {step === STEPS.CATEGORY && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Select one primary category for your listing:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setValue("category", cat, { shouldValidate: true })}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 ring-2 ring-zinc-900 dark:ring-zinc-100 font-bold"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
                      }`}
                    >
                      <Sparkles size={20} className={selectedCategory === cat ? "text-[#FF385C]" : "text-zinc-400"} />
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-4">{cat}</span>
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
              </div>
            )}

            {/* STEP 2: LOCATION */}
            {step === STEPS.LOCATION && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#FF385C]" />
                    City
                  </label>
                  <input
                    {...register("location_city")}
                    type="text"
                    placeholder="e.g. Malibu, Paris, Tokyo"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                  {errors.location_city && <p className="text-xs text-red-500">{errors.location_city.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#FF385C]" />
                    Country
                  </label>
                  <input
                    {...register("location_country")}
                    type="text"
                    placeholder="e.g. United States, France, Japan"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                  {errors.location_country && <p className="text-xs text-red-500">{errors.location_country.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 3: PROPERTY DETAILS */}
            {step === STEPS.DETAILS && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Listing Title
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    placeholder="e.g. Luxurious Beachfront Villa with Sunset Views"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Provide a vivid description of your place, ambiance, and amenities..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                      Max Guests
                    </label>
                    <input
                      {...register("max_guests", { valueAsNumber: true })}
                      type="number"
                      min={1}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                      Bedrooms
                    </label>
                    <input
                      {...register("bedrooms", { valueAsNumber: true })}
                      type="number"
                      min={1}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                      Bathrooms
                    </label>
                    <input
                      {...register("bathrooms", { valueAsNumber: true })}
                      type="number"
                      min={1}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Amenities (Comma-separated)
                  </label>
                  <input
                    {...register("amenities")}
                    type="text"
                    placeholder="WiFi, Air Conditioning, Swimming Pool, Free Parking"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: PRICE */}
            {step === STEPS.PRICE && (
              <div className="space-y-4 text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <DollarSign size={28} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Set your price per night</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  You can change your nightly price anytime after publishing.
                </p>

                <div className="max-w-xs mx-auto pt-4">
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-2xl font-bold text-zinc-400">$</span>
                    <input
                      {...register("price_per_night", { valueAsNumber: true })}
                      type="number"
                      min={1}
                      className="w-full pl-9 pr-4 py-3.5 rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-2xl font-bold text-zinc-900 dark:text-zinc-100 text-center focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none"
                    />
                  </div>
                  {errors.price_per_night && <p className="text-xs text-red-500 mt-2">{errors.price_per_night.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 5: PHOTOS */}
            {step === STEPS.PHOTOS && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-[#FF385C]" />
                    Hero Image URL
                  </label>
                  <input
                    {...register("image_url")}
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                  {errors.image_url && <p className="text-xs text-red-500">{errors.image_url.message}</p>}
                </div>

                {formValues.image_url && (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <ImageWithFallback
                      src={formValues.image_url}
                      alt="Hero Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    Extra Image URLs (Optional, 1 per line)
                  </label>
                  <textarea
                    {...register("extra_images")}
                    rows={2}
                    placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW & SUBMIT */}
            {step === STEPS.REVIEW && (
              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-3">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-700">
                    <ImageWithFallback
                      src={formValues.image_url}
                      alt={formValues.title || "Property"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute top-2 left-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {formValues.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{formValues.title || "Untitled Property"}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-zinc-400" />
                      {formValues.location_city}, {formValues.location_country}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    <span>{formValues.max_guests} guests • {formValues.bedrooms} bedrooms • {formValues.bathrooms} baths</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">${formValues.price_per_night} / night</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            {step > STEPS.CATEGORY ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={createListingMutation.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < STEPS.REVIEW ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FF385C] text-white font-semibold text-xs rounded-xl hover:bg-[#E00B41] transition-colors shadow-sm cursor-pointer"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={createListingMutation.isPending}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 size={16} />
                {createListingMutation.isPending ? "Publishing..." : "Publish Property"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
