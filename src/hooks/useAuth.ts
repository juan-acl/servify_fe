import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/auth";
import type {
  LoginDto,
  RegisterClientDto,
  RegisterProfessionalDto,
} from "../types/auth.types";
import { authService } from "../services/auth/auth.service";

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (response) => {
      login(response.user, response.tokenSession);
    },
  });
};

export const useRegisterClient = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterClientDto) => authService.registerClient(data),
    onSuccess: (response) => {
      login(response.user, response.tokenSession);
    },
  });
};

export const useRegisterProfessional = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterProfessionalDto) =>
      authService.registerProfessional(data),
    onSuccess: (response) => {
      login(response.user, response.tokenSession);
    },
  });
};
