import "@/styles/requestDetail.css";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { STATUS_LABELS, URGENCY_LABELS } from "@/utils/constants";
import { useCancelRequest, useRequestDetail } from "@/hooks/useRequest";
import { useRealtimeOffers } from "@/hooks/useRealtimeOffers";
import { useAcceptOffer, useRejectOffer } from "@/hooks/useOffer";
import { OfferCard } from "@/components/offer/cardOffer";

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: request, isLoading, error } = useRequestDetail(id!);
  const { realtimeOffers } = useRealtimeOffers(id!);
  const acceptMutation = useAcceptOffer();
  const rejectMutation = useRejectOffer();
  const cancelMutation = useCancelRequest();

  const allOffers = useMemo(() => {
    const backendOffers = request?.offers || [];
    const backendIds = new Set(backendOffers.map((o) => o.id));
    const newOffers = realtimeOffers.filter((o) => !backendIds.has(o.id));
    return [...newOffers, ...backendOffers];
  }, [request?.offers, realtimeOffers]);

  const pendingOffers = allOffers.filter((o) => o.status === "PENDING");
  const isNewOffer = (offerId: string) =>
    realtimeOffers.some((o) => o.id === offerId);

  const handleAccept = (offerId: string) => {
    acceptMutation.mutate(offerId, {
      onSuccess: (data) => {
        navigate(`/client/service/${data.execution.id}`);
      },
    });
  };

  const handleReject = (offerId: string) => {
    rejectMutation.mutate(offerId);
  };

  const handleCancel = () => {
    if (!id) return;
    const confirmed = window.confirm(
      "¿Estás seguro de cancelar esta solicitud? Se rechazarán todas las ofertas.",
    );
    if (confirmed) {
      cancelMutation.mutate(
        { id },
        { onSuccess: () => navigate("/client/dashboard") },
      );
    }
  };

  const canCancel =
    request?.status === "PENDING" ||
    request?.status === "ACTIVE" ||
    request?.status === "ACCEPTED";

  if (isLoading) {
    return (
      <div className="request-detail">
        <div className="request-detail-loading">
          <div className="request-detail-spinner" />
          <p>Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="request-detail">
        <div className="request-detail-error">
          <p>⚠️ {error?.message || "Solicitud no encontrada"}</p>
          <button onClick={() => navigate("/client/dashboard")}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="request-detail">
      <header className="request-detail-header">
        <button
          className="request-detail-back"
          onClick={() => navigate("/client/dashboard")}
        >
          ← Volver
        </button>
      </header>

      <div className="request-detail-info">
        <div className="request-detail-info-top">
          <div>
            <div className="request-detail-category">
              <img
                src={request.category?.icon}
                style={{
                  objectFit: "cover",
                  width: "stretch",
                  height: "40px",
                }}
              />
              <span>{request.category?.name || "Servicio"}</span>
            </div>
            <h1 className="request-detail-title">Mi Solicitud</h1>
          </div>
          <span className="request-detail-status">
            {STATUS_LABELS[request.status] || request.status}
          </span>
        </div>

        <p className="request-detail-description">{request.description}</p>

        <div className="request-detail-meta">
          <div className="request-detail-meta-item">
            <span className="request-detail-meta-icon">📍</span>
            <span>{request.address}</span>
          </div>
          <div className="request-detail-meta-item">
            <span className="request-detail-meta-icon">⏰</span>
            <span>{URGENCY_LABELS[request.urgency]}</span>
          </div>
          <div className="request-detail-meta-item">
            <span className="request-detail-meta-icon">📅</span>
            <span>{new Date(request.createdAt).toLocaleString("es-GT")}</span>
          </div>
        </div>

        {(request.status === "PENDING" || request.status === "ACTIVE") && (
          <div className="request-detail-expiration">
            ⏳ Expira:{" "}
            {new Date(request.expiresAt).toLocaleTimeString("es-GT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>

      <section className="request-detail-offers-section">
        <div className="request-detail-offers-header">
          <h2 className="request-detail-offers-title">
            Ofertas
            {pendingOffers.length > 0 && (
              <span className="request-detail-offers-count">
                {pendingOffers.length}
              </span>
            )}
          </h2>

          {(request.status === "PENDING" || request.status === "ACTIVE") && (
            <div className="request-detail-waiting">
              <div className="request-detail-waiting-dot" />
              <span>Esperando ofertas...</span>
            </div>
          )}
        </div>

        {allOffers.length === 0 ? (
          <div className="request-detail-no-offers">
            <span className="request-detail-no-offers-icon">📨</span>
            <h3>Aún no hay ofertas</h3>
            <p>
              Los profesionales están revisando tu solicitud. Las ofertas
              aparecerán aquí en tiempo real.
            </p>
          </div>
        ) : (
          <div className="request-detail-offers-list">
            {allOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onAccept={handleAccept}
                onReject={handleReject}
                isAccepting={acceptMutation.isPending}
                isNew={isNewOffer(offer.id)}
                disabled={request.status === "ACCEPTED"}
              />
            ))}
          </div>
        )}
      </section>

      {canCancel && (
        <button
          className="request-detail-cancel"
          onClick={handleCancel}
          disabled={cancelMutation.isPending}
        >
          {cancelMutation.isPending ? "Cancelando..." : "Cancelar Solicitud"}
        </button>
      )}
    </div>
  );
}
