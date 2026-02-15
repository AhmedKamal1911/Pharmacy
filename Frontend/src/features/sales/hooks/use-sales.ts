import { useMemo } from "react";
import { mockSalesStats } from "../api/mock-data";
import type { SalesStats } from "../types";

export function useSales() {
  const data = useMemo<SalesStats>(() => mockSalesStats, []);

  return {
    data,
    isLoading: false,
    isError: false,
  };
}
