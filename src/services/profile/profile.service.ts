import { api } from "@/config/api";
import type { User } from "@/types/auth.types";
import type {
  UpdateProfessionalProfileDto,
  UpdateProfileDto,
} from "@/types/profile.types";

export const profileService = {
  getProfile: () => api.get<unknown, User>("/auth/me"),

  updateProfile: (data: UpdateProfileDto) =>
    api.patch<unknown, User>("/users/profile", data),

  updateProfessionalProfile: (data: UpdateProfessionalProfileDto) =>
    api.patch<unknown, User>("/users/professional-profile", data),
};
