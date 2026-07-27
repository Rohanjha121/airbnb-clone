import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Share2,
  Star,
  ShieldCheck,
  UserCheck,
  Wifi,
  Tv,
  Car,
  Wind,
  Flame,
  Coffee,
  Sparkles,
  Waves,
  Utensils,
  AlertCircle,
} from "lucide-react";
import type { Listing } from "@/types/listing";
import { useCreateReservation, useListingReservations } from "@/hooks/useReservations";
import HeartButton from "@/components/common/HeartButton";
import ImageWithFallback from "@/components/common/ImageWithFallback";

interface ListingDetailProps {
  listing: Listing;
}

// Icon mapping helper for amenities
function getAmenityIcon(name: string) {
  const normalized = name.trim().toLowerCase();
  if (normalized.includes("wifi")) return <Wifi size={20} className="text-zinc-700 dark:text-zinc-300" />;
  if (normalized.includes("pool")) return <Waves size={20} className="text-zinc-700 dark:text-zinc-300" />;
  if (normalized.includes("beach")) return <Waves size={20} className="text-zinc-700 dark:text-zinc-300" />;
  if (normalized.includes("parking")) return <Car size={20} className="text-zinc-700 dark:text-zinc-300" />;
  if (normalized.includes("kitchen")) return <Utensils size={20} className="text-zinc-700 dark:text-zinc-300" />;
  if (normalized.includes("air") || normalized.includes("ac")) return <Wind size={20} className="text-zinc-700 dark:text-zinc-300" />;
  if (normalized.includes("bbq") || normalized.includes("fire") || normalized.includes("fireplace"))
    return <Flame size={20} className="text-zinc-700 dark:text-zinc-300" />;
  if (normalized.includes("coffee")) return <Coffee size={20} className="text-zinc-700 dark:text-zinc-300" />;
  if (normalized.includes("tv")) return <Tv size={20} className="text-zinc-700 dark:text-zinc-300" />;
  return <Sparkles size={20} className="text-zinc-700 dark:text-zinc-300" />;
}

// Rating generator
function getMockRating(id: string): { rating: string; reviews: number } {
  const hash = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rating = (4.7 + (hash % 25) / 100).toFixed(2);
  const reviews = 12 + (hash % 88);
  return { rating, reviews };
}

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

export default function ListingDetail({ listing }: ListingDetailProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsCount, setGuestsCount] = useState(2);

  const { data: existingReservations = [] } = useListingReservations(listing.id);
  const createReservationMutation = useCreateReservation();

  const { rating, reviews } = useMemo(() => getMockRating(listing.id), [listing.id]);

  const amenitiesList = useMemo(() => {
    if (!listing.amenities) return [];
    return listing.amenities.split(",").map((item) => item.trim()).filter(Boolean);
  }, [listing.amenities]);

  const extraImagesList = useMemo(() => {
    if (!listing.extra_images) return [];
    return listing.extra_images
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.startsWith("http"));
  }, [listing.extra_images]);

  const allImages = useMemo(() => {
    return [listing.image_url, ...extraImagesList];
  }, [listing.image_url, extraImagesList]);

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  // Check if selected dates overlap with any existing reservation
  const isOverlap = useMemo(() => {
    if (!checkIn || !checkOut || nights <= 0) return false;
    const reqIn = new Date(checkIn).getTime();
    const reqOut = new Date(checkOut).getTime();

    return existingReservations.some((res) => {
      const resIn = new Date(res.check_in).getTime();
      const resOut = new Date(res.check_out).getTime();
      return reqIn < resOut && reqOut > resIn;
    });
  }, [checkIn, checkOut, nights, existingReservations]);

  const nightlyTotal = listing.price_per_night * nights;
  const cleaningFee = Math.round(listing.price_per_night * 0.15);
  const serviceFee = Math.round(listing.price_per_night * 0.12);
  const grandTotal = nightlyTotal + cleaningFee + serviceFee;

  const handleReserveClick = async () => {
    if (!checkIn || !checkOut || !checkIn.trim() || !checkOut.trim()) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      toast.error("Checkout date must be after check-in date.");
      return;
    }

    if (isOverlap) {
      toast.error("These dates are already reserved. Please select different dates.");
      return;
    }

    try {
      await createReservationMutation.mutateAsync({
        listing_id: listing.id,
        check_in: checkIn,
        check_out: checkOut,
        guests: guestsCount,
      });

      toast.success("Reservation confirmed! View details in My Trips.");
      router.push("/trips");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to create reservation"));
    }
  };

  const handleShareClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back button & top actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to listings
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShareClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Share2 size={16} />
            Share
          </button>
          <HeartButton listingId={listing.id} showLabel size={16} />
        </div>
      </div>

      {/* Listing Title & Subheader */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {listing.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-100">
            <Star size={15} className="fill-zinc-900 stroke-zinc-900 dark:fill-zinc-100 dark:stroke-zinc-100" />
            <span>{rating}</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-normal">({reviews} reviews)</span>
          </div>
          <span>•</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">{listing.category}</span>
          <span>•</span>
          <span className="underline font-medium">
            {listing.location_city}, {listing.location_country}
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9] max-h-[480px]">
        {/* Main image */}
        <div className="relative md:col-span-2 h-full bg-zinc-100 dark:bg-zinc-800 group overflow-hidden">
          <ImageWithFallback
            src={allImages[0]}
            alt={listing.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>

        {/* Side images */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
          {allImages.slice(1, 5).map((img, idx) => (
            <div key={idx} className="relative h-full bg-zinc-100 dark:bg-zinc-800 group overflow-hidden">
              <ImageWithFallback
                src={img}
                alt={`${listing.title} extra ${idx + 1}`}
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            </div>
          ))}
          {/* Fallback tiles if fewer extra images */}
          {allImages.length < 5 &&
            Array.from({ length: 5 - allImages.length }).map((_, idx) => (
              <div key={`fill-${idx}`} className="relative h-full bg-zinc-100 dark:bg-zinc-800 group overflow-hidden">
                <ImageWithFallback
                  src={allImages[0]}
                  alt={`${listing.title} detail`}
                  fill
                  sizes="25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
            ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8 divide-y divide-zinc-200 dark:divide-zinc-800">
          {/* Host & Property Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Entire {listing.category.toLowerCase()} in {listing.location_city}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                  {listing.max_guests} guests • {listing.bedrooms} bedrooms • {listing.bathrooms} baths
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 dark:from-zinc-700 dark:to-zinc-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                H
              </div>
            </div>

            {/* Highlights badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-start gap-3">
                <ShieldCheck size={22} className="text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Superhost Property</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Experienced, highly rated host committed to great stays.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserCheck size={22} className="text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Great Check-in Experience</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">100% of recent guests gave check-in a 5-star rating.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Existing Reserved Dates Notice */}
          {existingReservations.length > 0 && (
            <div className="pt-6 space-y-2">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <AlertCircle size={16} className="text-amber-500" />
                Already Booked Dates
              </h3>
              <div className="flex flex-wrap gap-2">
                {existingReservations.map((res) => (
                  <span
                    key={res.id}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-medium text-amber-800 dark:text-amber-300"
                  >
                    {res.check_in} to {res.check_out}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="pt-8 space-y-3">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">About this space</h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="pt-8 space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {amenitiesList.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 py-1.5">
                  {getAmenityIcon(amenity)}
                  <span className="text-zinc-800 dark:text-zinc-200 text-sm font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Reservation Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl space-y-6">
            {/* Header / Price */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  ${listing.price_per_night.toFixed(0)}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 text-sm"> / night</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                <Star size={14} className="fill-zinc-900 stroke-zinc-900 dark:fill-zinc-100 dark:stroke-zinc-100" />
                <span>{rating}</span>
                <span className="text-zinc-500 dark:text-zinc-400 font-normal">({reviews})</span>
              </div>
            </div>

            {/* Date and Guests Selectors */}
            <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden divide-y divide-zinc-300 dark:divide-zinc-700">
              <div className="grid grid-cols-2 divide-x divide-zinc-300 dark:divide-zinc-700">
                <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/50">
                  <label className="block text-[10px] font-bold tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs font-medium text-zinc-900 dark:text-zinc-100 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
                  />
                </div>
                <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/50">
                  <label className="block text-[10px] font-bold tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">
                    Checkout
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs font-medium text-zinc-900 dark:text-zinc-100 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
              <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/50">
                <label className="block text-[10px] font-bold tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">
                  Guests
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full text-xs font-medium text-zinc-900 dark:text-zinc-100 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer mt-0.5"
                >
                  {Array.from({ length: listing.max_guests }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num} className="dark:bg-zinc-800 dark:text-zinc-100">
                      {num} {num === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Overlap Warning */}
            {isOverlap && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 font-medium">
                Selected dates overlap with an existing booking. Please choose different dates.
              </div>
            )}

            {checkIn && checkOut && nights <= 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-medium">
                Checkout date must be after check-in date.
              </div>
            )}

            {/* Reserve Action Button */}
            <button
              onClick={handleReserveClick}
              disabled={createReservationMutation.isPending || isOverlap}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF385C] to-[#E00B41] text-white font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {createReservationMutation.isPending ? "Reserving..." : "Reserve"}
            </button>

            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              You won't be charged yet
            </p>

            {/* Price breakdown */}
            {nights > 0 && (
              <div className="space-y-3 pt-2 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex justify-between">
                  <span className="underline">
                    ${listing.price_per_night.toFixed(0)} x {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                  <span>${nightlyTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Airbnb service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-bold text-zinc-900 dark:text-zinc-100 text-base">
                  <span>Total before taxes</span>
                  <span>${grandTotal}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
