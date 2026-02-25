import { createContext, useContext } from "react";
import type { SocketContextType } from "./socket.context";

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined,
);
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket debe usarse dentro de un SocketProvider");
  }
  return context.socket;
}
