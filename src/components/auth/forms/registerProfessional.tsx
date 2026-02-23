import { useState } from "react";
import { useForm } from "react-hook-form";
import type { RegisterProfessionalDto } from "../../../types/auth.types";
import Input from "../../input";

interface RegisterProfessionalFormProps {
  onSubmit: (data: RegisterProfessionalDto) => void;
  isLoading: boolean;
  error: string;
}

export function RegisterProfessionalForm({
  onSubmit,
  isLoading,
  error,
}: Readonly<RegisterProfessionalFormProps>) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterProfessionalDto>({
    defaultValues: { radiusKm: 10 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <div className="auth-error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="auth-row">
        <Input
          label="Nombre"
          placeholder="Pedro"
          error={errors.firstName?.message}
          {...register("firstName", { required: "El nombre es requerido" })}
        />
        <Input
          label="Apellido"
          placeholder="López"
          error={errors.lastName?.message}
          {...register("lastName", { required: "El apellido es requerido" })}
        />
      </div>

      <Input
        label="Teléfono"
        placeholder="50287654321"
        error={errors.phone?.message}
        {...register("phone", {
          required: "El teléfono es requerido",
          minLength: { value: 8, message: "Mínimo 8 dígitos" },
        })}
      />

      <Input
        label="Email"
        type="email"
        placeholder="correo@ejemplo.com"
        error={errors.email?.message}
        {...register("email", {
          required: "El email es requerido",
          pattern: { value: /^\S+@\S+$/, message: "Email inválido" },
        })}
      />

      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        placeholder="Mínimo 6 caracteres"
        error={errors.password?.message}
        rightElement={
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        }
        {...register("password", {
          required: "La contraseña es requerida",
          minLength: { value: 6, message: "Mínimo 6 caracteres" },
        })}
      />

      <Input
        label="Número de DPI"
        placeholder="1234567890101 (13 dígitos)"
        error={errors.dpiNumber?.message}
        {...register("dpiNumber", {
          required: "El DPI es requerido",
          minLength: { value: 13, message: "El DPI debe tener 13 dígitos" },
          maxLength: { value: 13, message: "El DPI debe tener 13 dígitos" },
        })}
      />

      <Input
        label="Biografía (opcional)"
        placeholder="Contanos sobre tu experiencia..."
        {...register("bio")}
      />

      <Input
        label="Radio de cobertura (km)"
        type="number"
        placeholder="10"
        error={errors.radiusKm?.message}
        {...register("radiusKm", {
          valueAsNumber: true,
          min: { value: 1, message: "Mínimo 1 km" },
          max: { value: 100, message: "Máximo 100 km" },
        })}
      />

      <button
        type="submit"
        className={`auth-submit ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "Cargando..." : "Crear Cuenta"}
      </button>
    </form>
  );
}
