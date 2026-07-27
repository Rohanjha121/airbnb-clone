export default function ListingCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-square w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      {/* Text lines */}
      <div className="mt-2.5 space-y-2">
        <div className="flex justify-between">
          <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/5" />
          <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-8" />
        </div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
      </div>
    </div>
  );
}
