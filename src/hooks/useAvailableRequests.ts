import { useQuery } from "@tanstack/react-query";
import { requestsService } from "../services/request/request.service";

export const useAvailableRequests = () => {
  return useQuery({
    queryKey: ["requests", "available"],
    queryFn: () => requestsService.getAvailable(),
    refetchInterval: 15000,
  });
};
