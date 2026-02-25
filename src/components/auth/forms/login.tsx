import Input from "@/components/input";
import type { LoginDto } from "@/types/auth.types";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginFormProps {
  onSubmit: (data: LoginDto) => void;
  isLoading: boolean;
  error: string;
}

export function LoginForm({
  onSubmit,
  isLoading,
  error,
}: Readonly<LoginFormProps>) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <div className="auth-error">
          <span>⚠️</span> {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="correo@ejemplo.com"
        error={errors.email?.message}
        {...register("email", {
          required: "El email es requerido",
          pattern: {
            value: /^\S+@\S+$/,
            message: "Email inválido",
          },
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
        {isLoading ? "Cargando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}
