import { api } from "@/config/api";
import type { CreateRequestDto, ServiceRequest } from "@/types/request.type";

export const requestsService = {
  getMyRequests: (status?: string) =>
    api.get<ServiceRequest, ServiceRequest[]>("/requests", {
      params: status ? { status } : undefined,
    }),

  getAvailable: () => api.get<unknown, ServiceRequest[]>("/requests/available"),

  getById: (id: string) => api.get<unknown, ServiceRequest>(`/requests/${id}`),

  create: (data: CreateRequestDto) =>
    api.post<unknown, ServiceRequest>("/requests", data),

  cancel: (id: string, reason?: string) =>
    api.patch<unknown, ServiceRequest>(`/requests/${id}/cancel`, { reason }),
};
