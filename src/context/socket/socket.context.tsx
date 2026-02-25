/* eslint-disable react-hooks/refs */
import { useEffect, useRef, type ReactNode } from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "../auth";
import { SocketContext } from ".";
import { disconnectSocket, getSocket } from "@/config/socket";

export interface SocketContextType {
  socket: Socket;
}

export function SocketProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket>(getSocket());

  useEffect(() => {
    const socket = socketRef.current;

    if (isAuthenticated && user) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("register", { userId: user.id });
    }

    return () => {};
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      socketRef.current = getSocket();
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}
