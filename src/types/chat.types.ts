export interface Conversation {
  id: string;
  requestId: string;
  clientId: string;
  professionalId: string;
  isActive: boolean;
  createdAt: string;
  request: {
    id: string;
    category: {
      name: string;
      icon: string;
    };
  };
  client: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  professional: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string | null;
  content: string;
  type: "TEXT" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
}

export interface PaginatedMessages {
  messages: Message[];
  hasMore: boolean;
  nextCursor: string | null;
}
