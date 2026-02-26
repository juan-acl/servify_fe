import { profileService } from "@/services/profile/profile.service";
import type {
  UpdateProfessionalProfileDto,
  UpdateProfileDto,
} from "@/types/profile.types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getProfile(),
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileDto) => profileService.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUpdateProfessionalProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfessionalProfileDto) =>
      profileService.updateProfessionalProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
