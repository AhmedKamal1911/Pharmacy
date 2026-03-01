import { useQuery } from "@tanstack/react-query";
import type { StockFilters } from "../types";
import { mockStockData } from "./mock-data";

export const stockKeys = {
  all: ["stock"] as const,
  lists: () => [...stockKeys.all, "list"] as const,
  list: (filters: StockFilters) => [...stockKeys.lists(), { filters }] as const,
};

export const useGetStock = () => {
  return useQuery({
    queryKey: stockKeys.lists(),
    queryFn: () => Promise.resolve(mockStockData),
  });
};
