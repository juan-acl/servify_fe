export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UpdateProfessionalProfileDto {
  bio?: string;
  radiusKm?: number;
  isAvailable?: boolean;
}
