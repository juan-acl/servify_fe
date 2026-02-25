import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { executionsService } from "../services/execution/execution.service";

export const useExecutionDetail = (id: string) => {
  return useQuery({
    queryKey: ["executions", id],
    queryFn: () => executionsService.getById(id),
    enabled: !!id,
    refetchInterval: 10000,
  });
};

export const useMarkInTransit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => executionsService.markInTransit(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["executions", id] });
    },
  });
};

export const useMarkArrived = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => executionsService.markArrived(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["executions", id] });
    },
  });
};

export const useStartWork = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => executionsService.startWork(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["executions", id] });
    },
  });
};

export const useCompleteWork = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => executionsService.complete(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["executions", id] });
    },
  });
};

export const useConfirmCompletion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => executionsService.confirm(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["executions", id] });
      qc.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};

export const useCancelExecution = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      reason,
      role,
    }: {
      id: string;
      reason?: string;
      role: "client" | "professional";
    }) =>
      role === "client"
        ? executionsService.cancelByClient(id, reason)
        : executionsService.cancelByProfessional(id, reason),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["executions", id] });
      qc.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};
