export default function ListingCardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {/* Image placeholder */}
      <div className="aspect-[20/19] w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      {/* Text lines */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/5" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-8" />
        </div>
        <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-4/5" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3 pt-1" />
      </div>
    </div>
  );
}
