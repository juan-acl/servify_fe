import { useAuth } from "@/context/auth";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to={"/"} replace />;
  const path = location.pathname;

  const isProfessional = path.includes("professional");
  if (isProfessional && user.role !== "PROFESSIONAL")
    return <Navigate to={"/"} replace />;
  if (!isProfessional && user.role !== "CLIENT")
    return <Navigate to={"/"} replace />;
  return <Outlet />;
};
