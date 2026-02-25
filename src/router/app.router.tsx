import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import AuthPage from "../pages/auth/auth.page";

const Dashboard = lazy(() => import("../pages/client/request/dashboard.page"));
const CreateRequestPage = lazy(
  () => import("../pages/client/request/createRequest.page"),
);
const RequestDetail = lazy(() => import("../pages/client/offer/RequestDetail"));
const ProfessionalDashboard = lazy(
  () => import("../pages/professional/Dashboard"),
);
const ProfessionalRequestDetail = lazy(
  () => import("../pages/professional/RequestDetail"),
);
const Chat = lazy(() => import("../pages/shared/chat/chat.page"));
const ActiveService = lazy(
  () => import("../pages/shared/service/activeService"),
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/client/dashboard" element={<Dashboard />} />
        <Route path="/client/request/new" element={<CreateRequestPage />} />
        <Route path="/client/request/:id" element={<RequestDetail />} />
        <Route
          path="/professional/dashboard"
          element={<ProfessionalDashboard />}
        />
        <Route
          path="/professional/requests/:id"
          element={<ProfessionalRequestDetail />}
        />
        <Route path="/client/service/:id" element={<ActiveService />} />
        <Route path="/professional/service/:id" element={<ActiveService />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};
