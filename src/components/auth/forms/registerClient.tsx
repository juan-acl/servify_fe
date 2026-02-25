import Input from "@/components/input";
import type { RegisterClientDto } from "@/types/auth.types";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface RegisterClientFormProps {
  onSubmit: (data: RegisterClientDto) => void;
  isLoading: boolean;
  error: string;
}

export function RegisterClientForm({
  onSubmit,
  isLoading,
  error,
}: Readonly<RegisterClientFormProps>) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterClientDto>();

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
          placeholder="Juan"
          error={errors.firstName?.message}
          {...register("firstName", { required: "El nombre es requerido" })}
        />
        <Input
          label="Apellido"
          placeholder="Pérez"
          error={errors.lastName?.message}
          {...register("lastName", { required: "El apellido es requerido" })}
        />
      </div>

      <Input
        label="Teléfono"
        placeholder="50212345678"
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
