import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Reservation, CreateReservationPayload } from "@/types/reservation";

async function fetchReservations(params?: { listing_id?: string; guest_id?: string }): Promise<Reservation[]> {
  const queryParams = new URLSearchParams();
  if (params?.listing_id) queryParams.set("listing_id", params.listing_id);
  if (params?.guest_id) queryParams.set("guest_id", params.guest_id);

  const queryStr = queryParams.toString();
  const endpoint = queryStr ? `/reservations?${queryStr}` : "/reservations";
  const { data } = await api.get<Reservation[]>(endpoint);
  return data;
}

export function useReservations(params?: { listing_id?: string; guest_id?: string }) {
  return useQuery({
    queryKey: ["reservations", params],
    queryFn: () => fetchReservations(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useListingReservations(listingId: string) {
  return useQuery({
    queryKey: ["reservations", "listing", listingId],
    queryFn: () => fetchReservations({ listing_id: listingId }),
    enabled: Boolean(listingId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateReservationPayload) => {
      const { data } = await api.post<Reservation>("/reservations", payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations", "listing", variables.listing_id] });
    },
  });
}

export function useHostReservations(hostId: string) {
  return useQuery({
    queryKey: ["reservations", "host", hostId],
    queryFn: async () => {
      const allReservations = await fetchReservations();
      return allReservations.filter((res) => res.listing?.host_id === hostId);
    },
    enabled: Boolean(hostId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<{ message: string }>(`/reservations/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

