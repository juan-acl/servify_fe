import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services/category/category.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
    staleTime: 1000 * 60 * 10,
  });
};
