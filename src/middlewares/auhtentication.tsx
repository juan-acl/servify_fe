import { useAuth } from "@/context/auth";
import { Navigate, Outlet } from "react-router-dom";

export const AuthenticationRoute = () => {
  const { token } = useAuth();
  if (token) {
    return <Outlet />;
  }

  return <Navigate to={"/"} />;
};
