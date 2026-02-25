import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../context/socket";
import type { Message } from "../types/chat.types";

export function useRealtimeChat(conversationId: string, userId: string) {
  const socket = useSocket();
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join_conversation", { conversationId });

    const handleNewMessage = (message: Message) => {
      setRealtimeMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== userId) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleTyping);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleTyping);
    };
  }, [conversationId, socket, userId]);

  const sendMessage = useCallback(
    (content: string) => {
      socket.emit("send_message", {
        conversationId,
        senderId: userId,
        content,
      });
    },
    [socket, conversationId, userId],
  );

  const sendTyping = useCallback(
    (typing: boolean) => {
      socket.emit("typing", {
        conversationId,
        userId,
        isTyping: typing,
      });
    },
    [socket, conversationId, userId],
  );

  const markRead = useCallback(() => {
    socket.emit("message_read", {
      conversationId,
      userId,
    });
  }, [socket, conversationId, userId]);

  return {
    realtimeMessages,
    isTyping,
    sendMessage,
    sendTyping,
    markRead,
  };
}
