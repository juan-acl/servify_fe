import { useMutation, useQuery } from "@tanstack/react-query";
import { chatService } from "../services/chat/chat.service";

export const useConversation = (id: string) => {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => chatService.getConversation(id),
    enabled: !!id,
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => chatService.getMessages(conversationId, 50),
    enabled: !!conversationId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });
};

export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: (conversationId: string) =>
      chatService.markAsRead(conversationId),
  });
};
