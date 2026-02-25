import "@/styles/chat.css";
import { useAuth } from "@/context/auth";
import { useConversation, useMarkAsRead, useMessages } from "@/hooks/useChat";
import { useRealtimeChat } from "@/hooks/useRealtimechat";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: conversation, isLoading: loadingConvo } = useConversation(id!);
  const { data: messagesData, isLoading: loadingMessages } = useMessages(id!);
  const markAsReadMutation = useMarkAsRead();

  const { realtimeMessages, isTyping, sendMessage, sendTyping, markRead } =
    useRealtimeChat(id!, user?.id || "");

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allMessages = useMemo(() => {
    const backend = messagesData?.messages || [];
    const backendIds = new Set(backend.map((m) => m.id));
    const newMessages = realtimeMessages.filter((m) => !backendIds.has(m.id));
    // viene en orden DESC, lo invertimos + agregamos nuevos al final
    return [...[...backend].reverse(), ...newMessages];
  }, [messagesData?.messages, realtimeMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  useEffect(() => {
    if (!id) return;
    markAsReadMutation.mutate(id);
    markRead();
  }, [id]);

  const otherPerson = conversation
    ? user?.id === conversation.clientId
      ? conversation.professional
      : conversation.client
    : null;

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    sendMessage(text);
    setInput("");
    sendTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);

    sendTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 3000);
  };

  if (loadingConvo || loadingMessages) {
    return (
      <div className="chat-page">
        <div className="chat-loading">
          <div className="chat-spinner" />
          <p>Cargando conversación...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="chat-page">
        <div className="chat-error">
          <p>Conversación no encontrada</p>
          <button onClick={() => navigate(-1)}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <button className="chat-back" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="chat-header-avatar">
          {otherPerson?.firstName?.charAt(0)}
          {otherPerson?.lastName?.charAt(0)}
        </div>
        <div className="chat-header-info">
          <span className="chat-header-name">
            {otherPerson?.firstName} {otherPerson?.lastName}
          </span>
          <img
            alt="Categoría"
            src={conversation.request.category.icon}
            style={{
              objectFit: "contain",
              width: "stretch",
              height: "40px",
            }}
          />
          <span className="chat-header-service">
            {conversation.request.category.name}
          </span>
        </div>
        {!conversation.isActive && (
          <span className="chat-header-closed">Cerrado</span>
        )}
      </header>

      <div className="chat-messages">
        {allMessages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          const isSystem = msg.type === "SYSTEM";

          if (isSystem) {
            return (
              <div key={msg.id} className="chat-msg-system">
                <span>{msg.content}</span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`chat-msg ${isMe ? "chat-msg-me" : "chat-msg-other"}`}
            >
              {!isMe && (
                <div className="chat-msg-avatar">
                  {msg.sender?.firstName?.charAt(0) || "?"}
                </div>
              )}
              <div className="chat-msg-bubble">
                <p className="chat-msg-text">{msg.content}</p>
                <span className="chat-msg-time">
                  {new Date(msg.createdAt).toLocaleTimeString("es-GT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div
            className="chat-msg chat-msg-other"
            style={{ marginBottom: "20px" }}
          >
            <div className="chat-msg-avatar">
              {otherPerson?.firstName?.charAt(0) || "?"}
            </div>
            <div className="chat-msg-bubble chat-typing-bubble">
              <div className="chat-typing-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {conversation.isActive ? (
        <div className="chat-input-wrapper">
          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí un mensaje..."
            rows={1}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            ➤
          </button>
        </div>
      ) : (
        <div className="chat-closed-banner">Esta conversación está cerrada</div>
      )}
    </div>
  );
}
