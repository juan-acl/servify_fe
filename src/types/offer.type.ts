export interface Offer {
  id: string;
  requestId: string;
  professionalId: string;
  price: number;
  estimatedArrivalMinutes: number;
  comment: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  professional: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    professionalProfile?: {
      bio: string | null;
      level: string;
    };
  };
}

export interface CreateOfferDto {
  requestId: string;
  price: number;
  estimatedArrivalMinutes: number;
  comment?: string;
}

export interface AcceptOfferResponse {
  acceptedOffer: Offer;
  execution: {
    id: string;
    originalPrice: number;
    finalPrice: number;
  };
  conversation: {
    id: string;
  };
}
