import type { User } from "./auth.types";

type Urgency = "EMERGENCY" | "TODAY" | "SCHEDULED";

export type ResponseCategories = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  categories: Category[];
};

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  categoryId: string;
  description: string;
  urgency: Urgency;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  scheduledAt: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  client?: Pick<User, "id" | "firstName" | "lastName" | "phone">;
  offers?: OfferSummary[];
  execution?: ExecutionSummary | null;
  _count?: { offers: number };
}

export interface OfferSummary {
  id: string;
  price: number;
  status: string;
  estimatedArrivalMinutes: number;
  comment: string | null;
  professional: {
    id: string;
    firstName: string;
    lastName: string;
    professionalProfile?: {
      bio: string | null;
      level: string;
    };
  };
}

export interface ExecutionSummary {
  id: string;
  originalPrice: number;
  finalPrice: number;
  startedAt: string | null;
  arrivedAt: string | null;
  completedAt: string | null;
}

export interface CreateRequestDto {
  categoryId: string;
  description: string;
  urgency: Urgency;
  address: string;
  latitude: number;
  longitude: number;
  scheduledAt?: string;
}

export interface RequestCardProps {
  request: ServiceRequest;
  onClick: (id: string) => void;
}
