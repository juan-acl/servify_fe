import type { AuthMode } from "@/types/auth.types";
import type React from "react";

type Props = {
  mode: AuthMode;
  switchMode: (newMode: AuthMode) => void;
};

export const AuthFooter: React.FC<Props> = ({ mode, switchMode }: Props) => {
  return (
    <>
      {mode === "login" ? (
        <>
          ¿No tenés cuenta?
          <span
            className="auth-switch-link"
            onClick={() => switchMode("register-client")}
          >
            Registrate
          </span>
        </>
      ) : (
        <>
          ¿Ya tenés cuenta?
          <span
            className="auth-switch-link"
            onClick={() => switchMode("login")}
          >
            Iniciá Sesión
          </span>
        </>
      )}
    </>
  );
};
