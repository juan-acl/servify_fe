import { api } from "@/config/api";
import type {
  AcceptOfferResponse,
  CreateOfferDto,
  Offer,
} from "@/types/offer.type";

export const offersService = {
  createOffer: (data: CreateOfferDto) =>
    api.post<unknown, Offer>("/offer", data),

  getMyOffers: () => api.get<unknown, Offer[]>("/offer/my-offers"),

  acceptOffer: (id: string) =>
    api.patch<unknown, AcceptOfferResponse>(`/offer/${id}/accept`),

  rejectOffer: (id: string) => api.patch<unknown, Offer>(`/offer/${id}/reject`),
};
