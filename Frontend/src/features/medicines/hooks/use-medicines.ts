import { useState, useEffect, useCallback } from "react";
import type { Medicine, MedicineFilters } from "../types";
import { medicinesApi } from "../api";

export function useMedicines(filters?: MedicineFilters) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicines = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await medicinesApi.getMedicines(filters);
      setMedicines(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch medicines",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const refetch = () => {
    fetchMedicines();
  };

  return {
    medicines,
    isLoading,
    error,
    refetch,
  };
}
