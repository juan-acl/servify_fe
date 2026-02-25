import "@/styles/createRequest.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { URGENCY_OPTIONS } from "@/utils/constants";
import Input from "../input";
import type { CreateRequestDto } from "@/types/request.type";
import { useCreateRequest } from "@/hooks/useRequest";
import { useCategories } from "@/hooks/useCategory";

export default function CreateRequest() {
  const navigate = useNavigate();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const createMutation = useCreateRequest();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRequestDto>();

  const onSubmit = (data: CreateRequestDto) => {
    const payload: CreateRequestDto = {
      ...data,
      categoryId: selectedCategory,
      urgency: selectedUrgency as CreateRequestDto["urgency"],
      latitude: data.latitude || 14.6133,
      longitude: data.longitude || -90.5353,
    };

    createMutation.mutate(payload, {
      onSuccess: (request) => {
        navigate(`/client/request/${request.id}`);
      },
    });
  };

  const error = createMutation.error?.message || "";
  const isLoading = createMutation.isPending;

  return (
    <div className="create-request">
      <header className="create-request-header">
        <button className="create-request-back" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="create-request-title">Nueva Solicitud</h1>
        <p className="create-request-subtitle">
          Describí lo que necesitás y recibí ofertas en minutos
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <div className="create-request-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <section className="create-request-section">
          <h2 className="create-request-section-title">
            <span className="create-request-step">1</span>
            ¿Qué servicio necesitás?
          </h2>

          {loadingCategories ? (
            <p className="create-request-loading-text">
              Cargando categorías...
            </p>
          ) : (
            <div className="create-request-categories">
              {categories?.categories?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`create-request-category ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <img
                    alt="Icono de categoría"
                    className="create-request-category-icon"
                    src={cat.icon}
                    style={{
                      objectFit: "cover",
                      width: "stretch",
                    }}
                  />
                  <span className="create-request-category-name">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!selectedCategory && errors.categoryId && (
            <span className="create-request-field-error">
              Seleccioná una categoría
            </span>
          )}
        </section>

        <section className="create-request-section">
          <h2 className="create-request-section-title">
            <span className="create-request-step">2</span>
            Describí el problema
          </h2>

          <div className="create-request-field">
            <textarea
              className={`create-request-textarea ${errors.description ? "error" : ""}`}
              placeholder="Ej: Tengo una fuga de agua debajo del fregadero de la cocina, el agua no para de salir y está mojando el piso..."
              rows={4}
              {...register("description", {
                required: "La descripción es requerida",
                minLength: {
                  value: 20,
                  message:
                    "Mínimo 20 caracteres para que el profesional entienda bien",
                },
                maxLength: { value: 1000, message: "Máximo 1000 caracteres" },
              })}
            />
            {errors.description && (
              <span className="create-request-field-error">
                {errors.description.message}
              </span>
            )}
          </div>
        </section>

        <section className="create-request-section">
          <h2 className="create-request-section-title">
            <span className="create-request-step">3</span>
            ¿Qué tan urgente es?
          </h2>

          <div className="create-request-urgency-options">
            {URGENCY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`create-request-urgency ${selectedUrgency === option.value ? "active" : ""}`}
                onClick={() => setSelectedUrgency(option.value)}
              >
                <span className="create-request-urgency-icon">
                  {option.icon}
                </span>
                <div className="create-request-urgency-content">
                  <span className="create-request-urgency-label">
                    {option.label}
                  </span>
                  <span className="create-request-urgency-desc">
                    {option.description}
                  </span>
                </div>
                <span className="create-request-urgency-time">
                  {option.time}
                </span>
              </button>
            ))}
          </div>

          {selectedUrgency === "SCHEDULED" && (
            <div className="create-request-scheduled">
              <Input
                label="Fecha y hora programada"
                type="datetime-local"
                error={errors.scheduledAt?.message}
                {...register("scheduledAt", {
                  required:
                    selectedUrgency === "SCHEDULED"
                      ? "La fecha es requerida para servicios programados"
                      : false,
                })}
              />
            </div>
          )}
        </section>

        <section className="create-request-section">
          <h2 className="create-request-section-title">
            <span className="create-request-step">4</span>
            ¿Dónde necesitás el servicio?
          </h2>

          <Input
            label="Dirección completa"
            placeholder="Ej: 5ta Avenida 12-34, Zona 10, Guatemala"
            error={errors.address?.message}
            {...register("address", {
              required: "La dirección es requerida",
              minLength: { value: 5, message: "Mínimo 5 caracteres" },
            })}
          />

          <div className="create-request-coords-row">
            <Input
              label="Latitud"
              type="number"
              step="any"
              placeholder="14.6133"
              error={errors.latitude?.message}
              {...register("latitude", {
                valueAsNumber: true,
              })}
            />
            <Input
              label="Longitud"
              type="number"
              step="any"
              placeholder="-90.5353"
              error={errors.longitude?.message}
              {...register("longitude", {
                valueAsNumber: true,
              })}
            />
          </div>

          <p className="create-request-coords-hint">
            En la versión final esto se llenará automáticamente con un mapa
          </p>
        </section>

        <button
          type="submit"
          className={`create-request-submit ${isLoading ? "loading" : ""}`}
          disabled={isLoading || !selectedCategory || !selectedUrgency}
        >
          {isLoading ? "Creando solicitud..." : "Publicar Solicitud"}
        </button>
      </form>
    </div>
  );
}
