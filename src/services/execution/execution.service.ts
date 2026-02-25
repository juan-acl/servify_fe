import { api } from "@/config/api";
import type { Execution } from "@/types/execution.types";

export const executionsService = {
  getById: (id: string) => api.get<unknown, Execution>(`/execution/${id}`),

  markInTransit: (id: string) =>
    api.patch<unknown, Execution>(`/execution/${id}/in-transit`),

  markArrived: (id: string) =>
    api.patch<unknown, Execution>(`/execution/${id}/arrived`),

  startWork: (id: string) =>
    api.patch<unknown, Execution>(`/execution/${id}/start`),

  complete: (id: string) =>
    api.patch<unknown, Execution>(`/execution/${id}/completed`),

  confirm: (id: string) =>
    api.patch<unknown, Execution>(`/execution/${id}/confirmedClient`),

  cancelByClient: (id: string, reason?: string) =>
    api.patch<unknown, Execution>(`/execution/${id}/cancel/client`, {
      reason,
    }),

  cancelByProfessional: (id: string, reason?: string) =>
    api.patch<unknown, Execution>(`/execution/${id}/cancel/professional`, {
      reason,
    }),
};
