type Role = "CLIENT" | "PROFESSIONAL" | "ADMIN";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  professionalProfile?: ProfessionalProfile | null;
}

export interface ProfessionalProfile {
  id: string;
  userId: string;
  dpiNumber: string;
  bio: string | null;
  radiusKm: number;
  isAvailable: boolean;
  isVerifiedByAdmin: boolean;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterClientDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface RegisterProfessionalDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dpiNumber: string;
  bio?: string;
  radiusKm?: number;
}

export interface AuthResponse {
  user: User;
  tokenSession: string;
}

export type AuthMode = "login" | "register-client" | "register-professional";
