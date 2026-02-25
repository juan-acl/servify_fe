import { api } from "@/config/api";
import type {
  AuthResponse,
  LoginDto,
  RegisterClientDto,
  RegisterProfessionalDto,
  User,
} from "@/types/auth.types";

export const authService = {
  login: (data: LoginDto) =>
    api.post<LoginDto, AuthResponse>("/auth/login", data),

  registerClient: (data: RegisterClientDto) =>
    api.post<RegisterClientDto, AuthResponse>("/auth/register/client", data),

  registerProfessional: (data: RegisterProfessionalDto) =>
    api.post<RegisterProfessionalDto, AuthResponse>(
      "/auth/register/professional",
      data,
    ),

  getProfile: () => api.get<unknown, User>("/auth/me"),
};
