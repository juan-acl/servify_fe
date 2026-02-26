import { api } from "@/config/api";
import type { Notification } from "@/types/notification.types";

export const notificationsService = {
  getAll: () => api.get<unknown, Notification[]>("/notifications"),

  getUnreadCount: () =>
    api.get<unknown, { unreadCount: number }>("/notifications/unread-count"),

  markAsRead: (id: string) =>
    api.patch<unknown, Notification>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch<unknown, { updated: number }>("/notifications/read-all"),
};
