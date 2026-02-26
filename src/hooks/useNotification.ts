import { notificationsService } from "@/services/notification/notification.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsService.getAll(),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationsService.getUnreadCount(),
    refetchInterval: 30000, // Polling cada 30s como fallback
  });
};

export const useMarkAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
