import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Listing, ListingFilters } from "@/types/listing";

export type ListingCreateInput = Omit<Listing, "id" | "host_id" | "created_at">;
export type ListingUpdateInput = Partial<ListingCreateInput>;

async function fetchListings(filters: ListingFilters & { host_id?: string }): Promise<Listing[]> {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.location) params.set("location", filters.location);
  if (filters.min_price !== undefined)
    params.set("min_price", String(filters.min_price));
  if (filters.max_price !== undefined)
    params.set("max_price", String(filters.max_price));
  if (filters.guests !== undefined)
    params.set("guests", String(filters.guests));
  if (filters.host_id) params.set("host_id", filters.host_id);

  const queryStr = params.toString();
  const endpoint = queryStr ? `/listings?${queryStr}` : "/listings";
  const { data } = await api.get<Listing[]>(endpoint);
  return data;
}

export function useListings(filters: ListingFilters & { host_id?: string } = {}) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => fetchListings(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ListingCreateInput) => {
      const { data } = await api.post<Listing>("/listings", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: payload }: { id: string; data: ListingUpdateInput }) => {
      const { data } = await api.patch<Listing>(`/listings/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", variables.id] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<{ message: string }>(`/listings/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

