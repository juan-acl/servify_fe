import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "../pages/auth/auth.page";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
};
