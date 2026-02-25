import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestsService } from "../services/request/request.service";
import type { CreateRequestDto } from "../types/request.type";

export const useMyRequests = (status?: string) => {
  return useQuery({
    queryKey: ["requests", "mine", status],
    queryFn: () => requestsService.getMyRequests(status),
  });
};

export const useRequestDetail = (id: string) => {
  return useQuery({
    queryKey: ["requests", id],
    queryFn: () => requestsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRequestDto) => requestsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};

export const useCancelRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      requestsService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};
