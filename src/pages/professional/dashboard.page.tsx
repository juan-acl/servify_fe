import "@/styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { URGENCY_RULES } from "@/utils/constants";
import { minutesLeft, timeAgo } from "@/utils/time";
import { useAuth } from "@/context/auth";
import { useAvailableRequests } from "@/hooks/useAvailableRequests";
import { NotificationBell } from "@/components/notification/notificationBell";

export default function ProfessionalDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: requests, isLoading, error } = useAvailableRequests();

  return (
    <div className="pro-dashboard">
      <header className="pro-dashboard-header">
        <div>
          <p className="pro-dashboard-subtitle">
            Solicitudes disponibles en tu zona
          </p>
        </div>
        <div className="pro-dashboard-header-actions">
          <NotificationBell />
          <button
            className="pro-dashboard-btn-profile"
            onClick={() => navigate("/profile")}
          >
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </button>
          <button className="pro-dashboard-btn-logout" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <div className="pro-dashboard-stats">
        <div className="pro-dashboard-stat">
          <span className="pro-dashboard-stat-value">
            {requests?.length || 0}
          </span>
          <span className="pro-dashboard-stat-label">Disponibles</span>
        </div>
        <div className="pro-dashboard-stat">
          <span className="pro-dashboard-stat-value">
            {requests?.filter((r) => r.urgency === "EMERGENCY").length || 0}
          </span>
          <span className="pro-dashboard-stat-label">Emergencias</span>
        </div>
      </div>

      <div className="pro-dashboard-content">
        <h2 className="pro-dashboard-section-title">
          Solicitudes Disponibles
          {!isLoading && requests && requests.length > 0 && (
            <span className="pro-dashboard-count">{requests.length}</span>
          )}
        </h2>

        {isLoading && (
          <div className="pro-dashboard-loading">
            <div className="pro-dashboard-spinner" />
            <p>Buscando solicitudes...</p>
          </div>
        )}

        {error && <div className="pro-dashboard-error">⚠️ {error.message}</div>}

        {!isLoading && !error && requests?.length === 0 && (
          <div className="pro-dashboard-empty">
            <h3>No hay solicitudes disponibles</h3>
            <p>
              Las nuevas solicitudes aparecerán aquí automáticamente. Se
              actualiza cada 15 segundos.
            </p>
          </div>
        )}

        {!isLoading && requests && requests.length > 0 && (
          <div className="pro-dashboard-requests">
            {requests.map((request) => {
              const urgency =
                URGENCY_RULES[request.urgency] || URGENCY_RULES.TODAY;

              return (
                <div
                  key={request.id}
                  className="pro-request-card"
                  onClick={() =>
                    navigate(`/professional/requests/${request.id}`)
                  }
                >
                  <div className="pro-request-card-top">
                    <div className="pro-request-card-category">
                      <img
                        alt="Categoría"
                        src={request.category?.icon}
                        style={{
                          objectFit: "cover",
                          width: "stretch",
                          height: "40px",
                        }}
                      />
                      <span>{request.category?.name || "Servicio"}</span>
                    </div>
                    <span
                      className={`pro-request-card-urgency ${urgency.class}`}
                    >
                      {urgency.label}
                    </span>
                  </div>

                  <p className="pro-request-card-description">
                    {request.description}
                  </p>

                  <div className="pro-request-card-address">
                    {request.address}
                  </div>

                  <div className="pro-request-card-footer">
                    <span className="pro-request-card-time">
                      {timeAgo(request.createdAt)}
                    </span>
                    <span className="pro-request-card-expires">
                      {minutesLeft(request.expiresAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
