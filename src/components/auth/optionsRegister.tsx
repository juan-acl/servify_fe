import type { AuthMode } from "../../types/auth.types";

type Props = {
  isRegister: boolean;
  mode: AuthMode;
  switchMode: (newMode: AuthMode) => void;
};

export const OptionsRegister = ({ mode, switchMode, isRegister }: Props) => {
  return (
    <>
      {isRegister && (
        <div className="auth-role-toggle">
          <button
            className={`auth-role-btn ${mode === "register-client" ? "active" : ""}`}
            onClick={() => switchMode("register-client")}
          >
            🏠 Cliente
          </button>
          <button
            className={`auth-role-btn ${mode === "register-professional" ? "active" : ""}`}
            onClick={() => switchMode("register-professional")}
          >
            🔧 Profesional
          </button>
        </div>
      )}
    </>
  );
};
