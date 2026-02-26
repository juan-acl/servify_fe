import { useAuth } from "@/context/auth";
import "@/styles/offertCard.css";
import type { OfferCardOffer } from "@/types/offer.type";
import { useNavigate } from "react-router-dom";

interface OfferCardProps {
  offer: OfferCardOffer;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
  isAccepting: boolean;
  isNew?: boolean;
  disabled?: boolean;
  executionId: string | undefined;
}

export function OfferCard({
  offer,
  onAccept,
  onReject,
  isAccepting,
  isNew = false,
  disabled = false,
  executionId,
}: Readonly<OfferCardProps>) {
  const { user } = useAuth();
  const professional = offer.professional;
  const navigate = useNavigate();
  const initials =
    (professional.firstName?.charAt(0) || "") +
    (professional.lastName?.charAt(0) || "");
  const level = professional.professionalProfile?.level || "BRONZE";

  const LEVEL_CONFIG: Record<string, { label: string; class: string }> = {
    BRONZE: { label: "🥉 Bronce", class: "level-bronze" },
    SILVER: { label: "🥈 Plata", class: "level-silver" },
    GOLD: { label: "🥇 Oro", class: "level-gold" },
    PLATINUM: { label: "💎 Platino", class: "level-platinum" },
  };

  const levelInfo = LEVEL_CONFIG[level] || LEVEL_CONFIG.BRONZE;

  const getDetailsExecution = (id: string) => {
    const role = user?.role;
    if (role === "CLIENT") {
      navigate(`/client/service/${id}`);
      return;
    }
    navigate(`/professional/service/${id}`);
  };

  return (
    <div className={`offer-card ${isNew ? "offer-card-new" : ""}`}>
      {isNew && <div className="offer-card-new-badge">✨ Nueva oferta</div>}

      {/* Professional Info */}
      <div
        className="offer-card-header"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="offer-card-header">
          <div className="offer-card-avatar">{initials}</div>
          <div className="offer-card-info">
            <span className="offer-card-name">
              {professional.firstName} {professional.lastName}
            </span>
            <span className={`offer-card-level ${levelInfo.class}`}>
              {levelInfo.label}
            </span>
          </div>
        </div>
        {executionId && (
          <div style={{ marginTop: "-12px" }}>
            <button
              onClick={() => getDetailsExecution(executionId)}
              className="offer-card-btn-accept"
            >
              ver status
            </button>
          </div>
        )}
      </div>

      {/* Bio */}
      {professional.professionalProfile?.bio && (
        <p className="offer-card-bio">{professional.professionalProfile.bio}</p>
      )}

      {/* Comment */}
      {offer.comment && (
        <div className="offer-card-comment">
          <span className="offer-card-comment-icon">💬</span>
          <p>{offer.comment}</p>
        </div>
      )}

      {/* Price & ETA */}
      <div className="offer-card-details">
        <div className="offer-card-detail">
          <span className="offer-card-detail-label">Precio</span>
          <span className="offer-card-detail-value offer-card-price">
            Q{offer.price.toFixed(2)}
          </span>
        </div>
        <div className="offer-card-detail-divider" />
        <div className="offer-card-detail">
          <span className="offer-card-detail-label">Tiempo estimado</span>
          <span className="offer-card-detail-value">
            {offer.estimatedArrivalMinutes} min
          </span>
        </div>
      </div>

      {/* Actions */}
      {offer.status === "PENDING" && (
        <div className="offer-card-actions">
          <button
            className="offer-card-btn-accept"
            onClick={() => onAccept(offer.id)}
            disabled={isAccepting || disabled}
          >
            {isAccepting ? "Aceptando..." : "✓ Aceptar Oferta"}
          </button>
          <button
            className="offer-card-btn-reject"
            onClick={() => onReject(offer.id)}
            disabled={isAccepting || disabled}
          >
            ✕
          </button>
        </div>
      )}

      {offer.status === "ACCEPTED" && (
        <div className="offer-card-status-accepted">✓ Oferta Aceptada</div>
      )}

      {offer.status === "REJECTED" && (
        <div className="offer-card-status-rejected">Rechazada</div>
      )}
    </div>
  );
}
