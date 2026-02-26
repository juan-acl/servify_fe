import "@/styles/profile.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/auth";
import Input from "@/components/input";
import {
  useProfile,
  useUpdateProfessionalProfile,
  useUpdateProfile,
} from "@/hooks/useProfile";
import type {
  UpdateProfessionalProfileDto,
  UpdateProfileDto,
} from "@/types/profile.types";
import type { User } from "@/types/auth.types";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const updateProMutation = useUpdateProfessionalProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPro, setIsEditingPro] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileDto>();

  const {
    register: registerPro,
    handleSubmit: handleSubmitPro,
    reset: resetPro,
    formState: { errors: errorsPro },
  } = useForm<UpdateProfessionalProfileDto>();

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      });
      if (profile.professionalProfile) {
        resetPro({
          bio: profile.professionalProfile.bio || "",
          radiusKm: profile.professionalProfile.radiusKm,
          isAvailable: profile.professionalProfile.isAvailable,
        });
      }
    }
  }, [profile, reset, resetPro]);

  const onSubmitProfile = (data: UpdateProfileDto) => {
    updateMutation.mutate(data, {
      onSuccess: (updated: User) => {
        updateUser(updated);
        setIsEditing(false);
      },
    });
  };

  const onSubmitPro = (data: UpdateProfessionalProfileDto) => {
    updateProMutation.mutate(data, {
      onSuccess: () => setIsEditingPro(false),
    });
  };

  const isProfessional = user?.role === "PROFESSIONAL";

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner" />
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="profile-back" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="profile-title">Mi Perfil</h1>
      </header>

      <div className="profile-hero">
        <div className="profile-avatar">
          {profile?.firstName?.charAt(0)}
          {profile?.lastName?.charAt(0)}
        </div>
        <h2 className="profile-name">
          {profile?.firstName} {profile?.lastName}
        </h2>
        <span className="profile-role">
          {isProfessional ? "🔧 Profesional" : "🏠 Cliente"}
        </span>
        {isProfessional && profile?.professionalProfile && (
          <div className="profile-badges">
            <span
              className={`profile-badge ${profile.professionalProfile.isVerifiedByAdmin ? "verified" : "unverified"}`}
            >
              {profile.professionalProfile.isVerifiedByAdmin
                ? "✓ Verificado"
                : "⏳ Pendiente verificación"}
            </span>
            <span className="profile-badge level">
              {profile.professionalProfile.level}
            </span>
          </div>
        )}
      </div>

      <div className="profile-section">
        <div className="profile-section-header">
          <h3 className="profile-section-title">Información Personal</h3>
          {!isEditing ? (
            <button
              className="profile-edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
          ) : (
            <button
              className="profile-cancel-btn"
              onClick={() => {
                setIsEditing(false);
                reset();
              }}
            >
              Cancelar
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">Nombre</span>
              <span className="profile-info-value">{profile?.firstName}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Apellido</span>
              <span className="profile-info-value">{profile?.lastName}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{profile?.email}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Teléfono</span>
              <span className="profile-info-value">
                {profile?.phone || "No registrado"}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Miembro desde</span>
              <span className="profile-info-value">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("es-GT", {
                      year: "numeric",
                      month: "long",
                    })
                  : "-"}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmitProfile)} noValidate>
            {updateMutation.error && (
              <div className="profile-form-error">
                ⚠️ {updateMutation.error.message}
              </div>
            )}
            <div className="profile-form-row">
              <Input
                label="Nombre"
                error={errors.firstName?.message}
                {...register("firstName", {
                  required: "El nombre es requerido",
                })}
              />
              <Input
                label="Apellido"
                error={errors.lastName?.message}
                {...register("lastName", {
                  required: "El apellido es requerido",
                })}
              />
            </div>
            <Input
              label="Teléfono"
              error={errors.phone?.message}
              {...register("phone", {
                minLength: { value: 8, message: "Mínimo 8 dígitos" },
              })}
            />
            <button
              type="submit"
              className="profile-save-btn"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        )}
      </div>

      {/* Professional Profile */}
      {isProfessional && profile?.professionalProfile && (
        <div className="profile-section">
          <div className="profile-section-header">
            <h3 className="profile-section-title">Perfil Profesional</h3>
            {!isEditingPro ? (
              <button
                className="profile-edit-btn"
                onClick={() => setIsEditingPro(true)}
              >
                Editar
              </button>
            ) : (
              <button
                className="profile-cancel-btn"
                onClick={() => {
                  setIsEditingPro(false);
                  resetPro();
                }}
              >
                Cancelar
              </button>
            )}
          </div>

          {!isEditingPro ? (
            <div className="profile-info-grid">
              <div className="profile-info-item full">
                <span className="profile-info-label">Biografía</span>
                <span className="profile-info-value">
                  {profile.professionalProfile.bio || "Sin biografía"}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Radio de cobertura</span>
                <span className="profile-info-value">
                  {profile.professionalProfile.radiusKm} km
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Disponible</span>
                <span className="profile-info-value">
                  {profile.professionalProfile.isAvailable ? "✅ Sí" : "❌ No"}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">DPI</span>
                <span className="profile-info-value">
                  {profile.professionalProfile.dpiNumber}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitPro(onSubmitPro)} noValidate>
              {updateProMutation.error && (
                <div className="profile-form-error">
                  ⚠️ {updateProMutation.error.message}
                </div>
              )}
              <div className="profile-form-field">
                <label className="profile-form-label" htmlFor="bio">
                  Biografía
                </label>
                <textarea
                  className="profile-textarea"
                  rows={3}
                  placeholder="Contanos sobre tu experiencia..."
                  {...registerPro("bio")}
                />
              </div>
              <Input
                label="Radio de cobertura (km)"
                type="number"
                error={errorsPro.radiusKm?.message}
                {...registerPro("radiusKm", {
                  valueAsNumber: true,
                  min: { value: 1, message: "Mínimo 1 km" },
                  max: { value: 100, message: "Máximo 100 km" },
                })}
              />
              <div className="profile-form-field">
                <label className="profile-toggle-row">
                  <span className="profile-form-label">
                    Disponible para trabajar
                  </span>
                  <input
                    type="checkbox"
                    className="profile-toggle"
                    {...registerPro("isAvailable")}
                  />
                </label>
              </div>
              <button
                type="submit"
                className="profile-save-btn"
                disabled={updateProMutation.isPending}
              >
                {updateProMutation.isPending
                  ? "Guardando..."
                  : "Guardar Cambios"}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="profile-section">
        <h3 className="profile-section-title">Cuenta</h3>
        <button className="profile-logout-btn" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
