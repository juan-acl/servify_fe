import "@/styles/requestDetailprofessional.css";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { URGENCY_LABELS } from "@/utils/constants";
import { useRequestDetail } from "@/hooks/useRequest";
import { useCreateOffer } from "@/hooks/useOffer";
import type { CreateOfferDto } from "@/types/offer.type";
import Input from "@/components/input";

export default function ProfessionalRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: request, isLoading, error } = useRequestDetail(id!);
  const createOfferMutation = useCreateOffer();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<CreateOfferDto, "requestId">>({
    defaultValues: { estimatedArrivalMinutes: 20 },
  });

  const onSubmit = (data: Omit<CreateOfferDto, "requestId">) => {
    if (!id) return;

    createOfferMutation.mutate(
      {
        requestId: id,
        price: data.price,
        estimatedArrivalMinutes: data.estimatedArrivalMinutes,
        comment: data.comment || undefined,
      },
      {
        onSuccess: () => {
          navigate("/professional/dashboard");
        },
      },
    );
  };

  const offerError = createOfferMutation.error?.message || "";
  const isSending = createOfferMutation.isPending;

  if (isLoading) {
    return (
      <div className="pro-request-detail">
        <div className="pro-request-detail-loading">
          <div className="pro-request-detail-spinner" />
          <p>Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="pro-request-detail">
        <div className="pro-request-detail-error">
          <p>⚠️ {error?.message || "Solicitud no encontrada"}</p>
          <button onClick={() => navigate("/professional/dashboard")}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pro-request-detail">
      <header className="pro-request-detail-header">
        <button
          className="pro-request-detail-back"
          onClick={() => navigate("/professional/dashboard")}
        >
          ← Volver
        </button>
      </header>

      <div className="pro-request-detail-info">
        <div className="pro-request-detail-info-top">
          <div>
            <div className="pro-request-detail-category">
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
            <h1 className="pro-request-detail-title">Detalle de Solicitud</h1>
          </div>
          <span className="pro-request-detail-urgency">
            {URGENCY_LABELS[request.urgency]}
          </span>
        </div>

        <p className="pro-request-detail-description">{request.description}</p>

        <div className="pro-request-detail-meta">
          <div className="pro-request-detail-meta-item">
            <span>📍</span>
            <span>{request.address}</span>
          </div>
          <div className="pro-request-detail-meta-item">
            <span>👤</span>
            <span>
              {request.client?.firstName} {request.client?.lastName}
            </span>
          </div>
          <div className="pro-request-detail-meta-item">
            <span>📅</span>
            <span>{new Date(request.createdAt).toLocaleString("es-GT")}</span>
          </div>
          {request.scheduledAt && (
            <div className="pro-request-detail-meta-item">
              <span>🗓️</span>
              <span>
                Programado:{" "}
                {new Date(request.scheduledAt).toLocaleString("es-GT")}
              </span>
            </div>
          )}
        </div>

        <div className="pro-request-detail-offers-info">
          {request._count?.offers !== undefined
            ? `${request._count.offers} oferta${request._count.offers !== 1 ? "s" : ""} recibida${request._count.offers !== 1 ? "s" : ""}`
            : "Sin ofertas aún"}
        </div>
      </div>

      <div className="pro-request-detail-form-card">
        <h2 className="pro-request-detail-form-title">Enviar tu Oferta</h2>
        <p className="pro-request-detail-form-subtitle">
          Proponé un precio y tiempo estimado de llegada
        </p>

        {offerError && (
          <div className="pro-request-detail-form-error">
            <span>⚠️</span> {offerError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="pro-request-detail-form-row">
            <Input
              label="Precio (Q)"
              type="number"
              placeholder="150.00"
              error={errors.price?.message}
              {...register("price", {
                required: "El precio es requerido",
                valueAsNumber: true,
                min: { value: 1, message: "Mínimo Q1" },
                max: { value: 50000, message: "Máximo Q50,000" },
              })}
            />
            <Input
              label="Tiempo de llegada (min)"
              type="number"
              placeholder="20"
              error={errors.estimatedArrivalMinutes?.message}
              {...register("estimatedArrivalMinutes", {
                required: "El tiempo es requerido",
                valueAsNumber: true,
                min: { value: 1, message: "Mínimo 1 minuto" },
                max: { value: 480, message: "Máximo 8 horas" },
              })}
            />
          </div>

          <div className="pro-request-detail-form-field">
            <label className="pro-request-detail-form-label" htmlFor="comment">
              Mensaje al cliente (opcional)
            </label>
            <textarea
              className="pro-request-detail-textarea"
              placeholder="Ej: Tengo experiencia con este tipo de trabajo, llevo todos los materiales necesarios..."
              rows={3}
              {...register("comment")}
            />
          </div>

          <button
            type="submit"
            className={`pro-request-detail-submit ${isSending ? "loading" : ""}`}
            disabled={isSending}
          >
            {isSending ? "Enviando oferta..." : "🚀 Enviar Oferta"}
          </button>
        </form>
      </div>
    </div>
  );
}
