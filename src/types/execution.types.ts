export interface Execution {
  id: string;
  requestId: string;
  professionalId: string;
  originalPrice: number;
  finalPrice: number;
  startedAt: string | null;
  arrivedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  request: {
    id: string;
    description: string;
    address: string;
    urgency: string;
    status: string;
    category: {
      id: string;
      name: string;
      icon: string;
    };
    client: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
    };
    conversation?: {
      id: string;
    };
  };
  professional: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  conversation?: {
    id: string;
  };
}

// Estados posibles del servicio
export type ExecutionStatus =
  | "ACCEPTED"
  | "IN_TRANSIT"
  | "IN_PROGRESS"
  | "COMPLETED";
