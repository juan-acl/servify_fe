import { api } from "@/config/api";
import type { Conversation, PaginatedMessages } from "@/types/chat.types";

export const chatService = {
  getConversations: () => api.get<unknown, Conversation[]>("/chat"),

  getConversation: (id: string) =>
    api.get<unknown, Conversation>(`/chat/${id}`),

  getMessages: (conversationId: string, take = 30, cursor?: string) =>
    api.get<unknown, PaginatedMessages>(`/chat/${conversationId}/messages`, {
      params: { take, cursor },
    }),

  markAsRead: (conversationId: string) =>
    api.patch<unknown, { markedAsRead: number }>(
      `/chat/${conversationId}/read`,
    ),
};
