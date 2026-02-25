import { api } from "@/config/api";
import type { Category, ResponseCategories } from "@/types/request.type";

export const categoriesService = {
  getAll: () => api.get<unknown, ResponseCategories>("/category"),

  getById: (id: string) => api.get<unknown, Category>(`/category/${id}`),
};
