import { useState, useEffect } from "react";
import type { Category } from "../types";
import { categories } from "@/data/categories";

export function useCategories() {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Loading categories data:", categories);
      setCategoriesList(categories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refetch = () => {
    fetchCategories();
  };

  return {
    categories: categoriesList,
    isLoading,
    error,
    refetch,
  };
}
