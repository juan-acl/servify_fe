import { Branding } from "@/components/auth/branding";
import { AuthFooter } from "@/components/auth/footer";
import { LoginForm } from "@/components/auth/forms/login";
import { RegisterClientForm } from "@/components/auth/forms/registerClient";
import { RegisterProfessionalForm } from "@/components/auth/forms/registerProfessional";
import { OptionsRegister } from "@/components/auth/optionsRegister";
import {
  useLogin,
  useRegisterClient,
  useRegisterProfessional,
} from "@/hooks/useAuth";
import "@/styles/auth.page.css";
import type {
  AuthMode,
  LoginDto,
  RegisterClientDto,
  RegisterProfessionalDto,
} from "@/types/auth.types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mapLabel = {
  login: "Ingresá tus credenciales para acceder a tu cuenta",
  "register-client": "Registrate como cliente para solicitar servicios",
  "register-professional":
    "Registrate como profesional para ofrecer tus servicios",
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");

  const loginMutation = useLogin();
  const registerClientMutation = useRegisterClient();
  const registerProfessionalMutation = useRegisterProfessional();

  const mapMode = {
    login: loginMutation,
    "register-client": registerClientMutation,
    "register-professional": registerProfessionalMutation,
  };

  const activeMutation = mapMode[mode];
  const activeLabel = mapLabel[mode];

  const switchMode = (newMode: AuthMode) => {
    activeMutation.reset();
    setMode(newMode);
  };

  const handleLogin = (data: LoginDto) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        navigate(
          res.user.role === "PROFESSIONAL"
            ? "/professional/dashboard"
            : "/client/dashboard",
        );
      },
    });
  };

  const navigateDashboard = (role: string) => {
    if (role === "PROFESSIONAL") {
      navigate("/professional/dashboard");
    } else {
      navigate("/client/dashboard");
    }
  };

  const handleRegisterClient = (data: RegisterClientDto) => {
    registerClientMutation.mutate(data, {
      onSuccess: () => navigateDashboard("CLIENT"),
    });
  };

  const handleRegisterProfessional = (data: RegisterProfessionalDto) => {
    registerProfessionalMutation.mutate(data, {
      onSuccess: () => navigateDashboard("PROFESSIONAL"),
    });
  };

  const error = activeMutation.error?.message || "";
  const isLoading = activeMutation.isPending;
  const isRegister = mode !== "login";

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-form-wrapper">
          <h1
            className="auth-title"
            style={{ marginTop: isRegister ? "200px" : "40px" }}
          >
            {mode === "login" ? "¡Bienvenido!" : "Crear Cuenta"}
          </h1>
          <p className="auth-subtitle">{activeLabel}</p>

          <OptionsRegister
            mode={mode}
            switchMode={switchMode}
            isRegister={isRegister}
          />

          {mode === "login" && (
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          )}

          {mode === "register-client" && (
            <RegisterClientForm
              onSubmit={handleRegisterClient}
              isLoading={isLoading}
              error={error}
            />
          )}

          {mode === "register-professional" && (
            <RegisterProfessionalForm
              onSubmit={handleRegisterProfessional}
              isLoading={isLoading}
              error={error}
            />
          )}

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">o</span>
            <div className="auth-divider-line" />
          </div>

          <AuthFooter mode={mode} switchMode={switchMode} />
        </div>
      </div>

      <Branding />
    </div>
  );
}
