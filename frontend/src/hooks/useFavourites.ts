import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import type { Listing } from "@/types/listing";

export interface FavouriteToggleResponse {
  favourited: boolean;
  message: string;
  favourite?: any;
}

async function fetchFavourites(): Promise<Listing[]> {
  const { data } = await api.get<Listing[]>("/favourites");
  return data;
}

async function fetchFavouriteIds(): Promise<string[]> {
  const { data } = await api.get<string[]>("/favourites/ids");
  return data;
}

export function useFavourites() {
  return useQuery({
    queryKey: ["favourites"],
    queryFn: fetchFavourites,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useFavouriteIds() {
  return useQuery({
    queryKey: ["favourites", "ids"],
    queryFn: fetchFavouriteIds,
    staleTime: 1000 * 60 * 2,
  });
}

export function useToggleFavourite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const { data } = await api.post<FavouriteToggleResponse>(`/favourites/${listingId}`);
      return data;
    },
    onMutate: async (listingId: string) => {
      // 1. Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["favourites", "ids"] });

      // 2. Snapshot previous value
      const previousIds = queryClient.getQueryData<string[]>(["favourites", "ids"]) || [];

      // 3. Optimistically update the favourite IDs cache
      const isCurrentlyFavourited = previousIds.includes(listingId);
      const nextIds = isCurrentlyFavourited
        ? previousIds.filter((id) => id !== listingId)
        : [...previousIds, listingId];

      queryClient.setQueryData(["favourites", "ids"], nextIds);

      // Return context with previous state for rollback on error
      return { previousIds, isCurrentlyFavourited };
    },
    onSuccess: (data) => {
      toast.success(data.message || (data.favourited ? "Added to favourites!" : "Removed from favourites"));
    },
    onError: (err: any, listingId: string, context) => {
      // Rollback to previous snapshot on failure
      if (context?.previousIds) {
        queryClient.setQueryData(["favourites", "ids"], context.previousIds);
      }
      toast.error(err?.response?.data?.detail || "Failed to update favourite status");
    },
    onSettled: () => {
      // Invalidate queries to sync with backend state
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      queryClient.invalidateQueries({ queryKey: ["favourites", "ids"] });
    },
  });
}
