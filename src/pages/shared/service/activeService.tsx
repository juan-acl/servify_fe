import { useAuth } from "@/context/auth";
import {
  useCancelExecution,
  useCompleteWork,
  useConfirmCompletion,
  useExecutionDetail,
  useMarkArrived,
  useMarkInTransit,
  useStartWork,
} from "@/hooks/useExecutions";
import "@/styles/activeService.css";
import { getStepIndex, STEPS } from "@/utils/constants";
import { useNavigate, useParams } from "react-router-dom";

export default function ActiveService() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: execution, isLoading, error } = useExecutionDetail(id!);

  const markInTransit = useMarkInTransit();
  const markArrived = useMarkArrived();
  const startWork = useStartWork();
  const completeWork = useCompleteWork();
  const confirmCompletion = useConfirmCompletion();
  console.log("validando el estado", confirmCompletion);
  const cancelExecution = useCancelExecution();

  const isProfessional = user?.role === "PROFESSIONAL";
  const isClient = user?.role === "CLIENT";

  if (isLoading) {
    return (
      <div className="active-service">
        <div className="active-service-loading">
          <div className="active-service-spinner" />
          <p>Cargando servicio...</p>
        </div>
      </div>
    );
  }

  if (error || !execution) {
    return (
      <div className="active-service">
        <div className="active-service-error">
          <p>⚠️ {error?.message || "Servicio no encontrado"}</p>
          <button onClick={() => navigate(-1)}>Volver</button>
        </div>
      </div>
    );
  }

  const status = execution.request.status;
  const currentStep = getStepIndex(status, execution.arrivedAt);
  const isCompleted = status === "COMPLETED";
  const isCancelled = status === "CANCELLED";

  const getNextAction = () => {
    if (!isProfessional || isCompleted || isCancelled) return null;

    if (status === "ACCEPTED") {
      return {
        label: "Estoy en camino",
        mutation: markInTransit,
        action: () => markInTransit.mutate(id!),
      };
    }
    if (status === "IN_TRANSIT" && !execution.arrivedAt) {
      return {
        label: "Ya llegué",
        mutation: markArrived,
        action: () => markArrived.mutate(id!),
      };
    }
    if (status === "IN_TRANSIT" && execution.arrivedAt) {
      return {
        label: "Iniciar trabajo",
        mutation: startWork,
        action: () => startWork.mutate(id!),
      };
    }
    if (status === "IN_PROGRESS") {
      return {
        label: "Trabajo completado",
        mutation: completeWork,
        action: () => completeWork.mutate(id!),
      };
    }
    return null;
  };

  const nextAction = getNextAction();

  const canCancel = status === "ACCEPTED" || status === "IN_TRANSIT";

  const handleCancel = () => {
    const confirmed = window.confirm(
      "¿Estás seguro de cancelar este servicio?",
    );
    if (confirmed && id) {
      cancelExecution.mutate(
        { id, role: isProfessional ? "professional" : "client" },
        {
          onSuccess: () => {
            navigate(
              isProfessional ? "/professional/dashboard" : "/client/dashboard",
            );
          },
        },
      );
    }
  };

  const handleConfirm = () => {
    if (!id) return;
    confirmCompletion.mutate(id, {
      onSuccess: () => {
        navigate("/client/dashboard");
      },
    });
  };

  return (
    <div className="active-service">
      <header className="active-service-header">
        <button className="active-service-back" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="active-service-title">Servicio en Curso</h1>
      </header>

      {isCancelled && (
        <div className="active-service-cancelled">
          <span className="active-service-cancelled-icon">❌</span>
          <h2>Servicio Cancelado</h2>
          <p>Este servicio fue cancelado.</p>
        </div>
      )}

      {!isCancelled && (
        <div className="active-service-stepper">
          {STEPS.map((step, index) => {
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.key} className="active-service-step-wrapper">
                <div
                  className={`active-service-step ${isActive ? "active" : ""} ${isCurrent ? "current" : ""}`}
                >
                  <div className="active-service-step-circle">
                    {isActive ? step.icon : index + 1}
                  </div>
                  <span className="active-service-step-label">
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`active-service-step-line ${index < currentStep ? "active" : ""}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="active-service-info">
        <div className="active-service-info-row">
          <img
            alt="Categoría"
            className="active-service-info-icon"
            src={execution.request.category.icon}
            style={{
              objectFit: "contain",
              width: "40px",
              height: "40px",
            }}
          />

          <div>
            <span className="active-service-info-label">
              {execution.request.category.name}
            </span>
            <p className="active-service-info-desc">
              {execution.request.description}
            </p>
          </div>
        </div>

        <div className="active-service-info-details">
          <div className="active-service-info-detail">
            <span className="active-service-info-detail-label">
              Precio acordado
            </span>
            <span className="active-service-info-detail-value">
              Q{execution.finalPrice.toFixed(2)}
            </span>
          </div>
          <div className="active-service-info-detail-divider" />
          <div className="active-service-info-detail">
            <span className="active-service-info-detail-label">Dirección</span>
            <span className="active-service-info-detail-value-sm">
              {execution.request.address}
            </span>
          </div>
        </div>
      </div>

      <div className="active-service-contact">
        <div className="active-service-contact-row">
          <div className="active-service-contact-avatar">
            {isProfessional
              ? `${execution.request.client?.firstName.charAt(0)}${execution.request.client?.lastName.charAt(0)}`
              : `${execution.professional?.firstName.charAt(0)}${execution.professional?.lastName.charAt(0)}`}
          </div>
          <div className="active-service-contact-info">
            <span className="active-service-contact-role">
              {isProfessional ? "Cliente" : "Profesional"}
            </span>
            <span className="active-service-contact-name">
              {isProfessional
                ? `${execution.request.client?.firstName} ${execution.request.client?.lastName}`
                : `${execution.professional?.firstName} ${execution.professional?.lastName}`}
            </span>
          </div>
          <div className="active-service-contact-actions">
            {execution.request.conversation && (
              <button
                // disabled={execution.request.status === "COMPLETED"}
                className="active-service-btn-chat"
                onClick={() =>
                  navigate(`/chat/${execution.request.conversation!.id}`)
                }
              >
                Chat
              </button>
            )}
          </div>
        </div>
      </div>

      {(execution.arrivedAt ||
        execution.startedAt ||
        execution.completedAt) && (
        <div className="active-service-timestamps">
          {execution.arrivedAt && (
            <div className="active-service-timestamp">
              <span>📍 Llegó:</span>
              <span>
                {new Date(execution.arrivedAt).toLocaleTimeString("es-GT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {execution.startedAt && (
            <div className="active-service-timestamp">
              <span>Inició:</span>
              <span>
                {new Date(execution.startedAt).toLocaleTimeString("es-GT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {execution.completedAt && (
            <div className="active-service-timestamp">
              <span>Completó:</span>
              <span>
                {new Date(execution.completedAt).toLocaleTimeString("es-GT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>
      )}

      {nextAction && (
        <button
          className="active-service-action-btn"
          onClick={nextAction.action}
          disabled={nextAction.mutation.isPending}
        >
          {nextAction.mutation.isPending ? "Actualizando..." : nextAction.label}
        </button>
      )}

      {isClient && isCompleted && (
        <button
          className="active-service-confirm-btn"
          onClick={handleConfirm}
          disabled={confirmCompletion.isPending}
        >
          {confirmCompletion.isPending
            ? "Confirmando..."
            : "Confirmar Servicio Completado"}
        </button>
      )}

      {canCancel && (
        <button
          className="active-service-cancel-btn"
          onClick={handleCancel}
          disabled={cancelExecution.isPending}
        >
          {cancelExecution.isPending ? "Cancelando..." : "Cancelar Servicio"}
        </button>
      )}
    </div>
  );
}
