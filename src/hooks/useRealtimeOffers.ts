import { useEffect, useState } from "react";
import { useSocket } from "../context/socket";
import type { Offer } from "../types/offer.type";

export function useRealtimeOffers(requestId: string) {
  const socket = useSocket();
  const [realtimeOffers, setRealtimeOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (!requestId) return;

    socket.emit("join_request", { requestId });

    const handleNewOffer = (offer: Offer) => {
      setRealtimeOffers((prev) => {
        if (prev.some((o) => o.id === offer.id)) return prev;
        return [offer, ...prev];
      });
    };

    socket.on("new_offer", handleNewOffer);

    return () => {
      socket.off("new_offer", handleNewOffer);
    };
  }, [requestId, socket]);

  const clearRealtimeOffers = () => setRealtimeOffers([]);

  return { realtimeOffers, clearRealtimeOffers };
}
