import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { offersService } from "../services/offer/offer.service";
import type { CreateOfferDto } from "../types/offer.type";

export const useMyOffers = () => {
  return useQuery({
    queryKey: ["offers", "mine"],
    queryFn: () => offersService.getMyOffers(),
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOfferDto) => offersService.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};

export const useAcceptOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerId: string) => offersService.acceptOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};

export const useRejectOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerId: string) => offersService.rejectOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};
