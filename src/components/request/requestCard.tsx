import "@/styles/requestCard.css";
import type { RequestCardProps } from "@/types/request.type";
import { STATUS_CONFIG, URGENCY_CONFIG } from "@/utils/constants";
import { timeAgo } from "@/utils/time";

export function RequestCard({ request, onClick }: Readonly<RequestCardProps>) {
  const urgency = URGENCY_CONFIG[request.urgency] || URGENCY_CONFIG.TODAY;
  const status = STATUS_CONFIG[request.status] || STATUS_CONFIG.PENDING;

  return (
    <div className="request-card" onClick={() => onClick(request.id)}>
      <div className="request-card-header">
        <div className="request-card-category">
          <img
            alt="Categoría"
            className="request-card-category-icon"
            style={{
              objectFit: "cover",
              width: "stretch",
              height: "40px",
            }}
            src={request.category?.icon}
          />
          <span>{request.category?.name || "Servicio"}</span>
        </div>
        <span className={`request-card-urgency ${urgency.class}`}>
          {urgency.label}
        </span>
      </div>

      <p className="request-card-description">{request.description}</p>

      <div className="request-card-address">
        <span>{request.address}</span>
      </div>

      <div className="request-card-footer">
        <span className={`request-card-status ${status.class}`}>
          {status.label}
        </span>
        <div className="request-card-meta">
          {request._count?.offers !== undefined && (
            <span className="request-card-offers">
              {request._count.offers} oferta
              {request._count.offers && "s" && request._count.offers > 1
                ? "s"
                : ""}
            </span>
          )}
          <span className="request-card-time">
            {timeAgo(request.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
