import { NotificationBell } from "@/components/notification/notificationBell";
import { RequestCard } from "@/components/request/requestCard";
import { useAuth } from "@/context/auth";
import { useMyRequests } from "@/hooks/useRequest";
import "@/styles/dashboardRequest.css";
import { TABS } from "@/utils/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const { data: requests, isLoading, error } = useMyRequests(activeTab);

  const handleRequestClick = (id: string) => {
    navigate(`/client/request/${id}`);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Hola, {user?.firstName}</h1>
          <p className="dashboard-subtitle">¿Qué servicio necesitás hoy?</p>
        </div>
        <div className="dashboard-header-actions">
          <NotificationBell />
          <button
            className="dashboard-btn-profile"
            onClick={() => navigate("/profile")}
          >
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </button>
          <button className="dashboard-btn-logout" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <div
        className="dashboard-cta"
        onClick={() => navigate("/client/request/new")}
      >
        <div className="dashboard-cta-content">
          <h3 className="dashboard-cta-title">Nueva Solicitud</h3>
          <p className="dashboard-cta-text">
            Describí lo que necesitás y recibí ofertas de profesionales en
            minutos
          </p>
        </div>
        <span className="dashboard-cta-icon">+</span>
      </div>

      <div className="dashboard-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key || "all"}
            className={`dashboard-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {isLoading && (
          <div className="dashboard-loading">
            <div className="dashboard-spinner" />
            <p>Cargando solicitudes...</p>
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            <p>{error.message}</p>
          </div>
        )}

        {!isLoading && !error && requests?.length === 0 && (
          <div className="dashboard-empty">
            <h3>No tenés solicitudes</h3>
            <p>
              {activeTab
                ? `No hay solicitudes con estado "${TABS.find((t) => t.key === activeTab)?.label}"`
                : "Creá tu primera solicitud para recibir ofertas de profesionales"}
            </p>
            {!activeTab && (
              <button
                className="dashboard-empty-btn"
                onClick={() => navigate("/client/request/new")}
              >
                Crear Solicitud
              </button>
            )}
          </div>
        )}

        {!isLoading && requests && requests.length > 0 && (
          <div className="dashboard-requests">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={handleRequestClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
