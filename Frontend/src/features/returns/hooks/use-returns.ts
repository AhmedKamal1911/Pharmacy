import { useState, useEffect } from "react";
import type { ReturnInvoice, ReturnFilters } from "../types";
import { returnsApi } from "../api";

export function useReturns(filters?: ReturnFilters) {
  const [returns, setReturns] = useState<ReturnInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReturns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await returnsApi.getReturns(filters);
      setReturns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch returns");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    fetchReturns();
  };

  return {
    returns,
    isLoading,
    error,
    refetch,
  };
}
