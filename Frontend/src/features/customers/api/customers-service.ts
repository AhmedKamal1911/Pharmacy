import { useQuery } from "@tanstack/react-query";
import type { CustomerFilters } from "../types";
import { mockCustomers } from "./mock-data";

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: CustomerFilters) =>
    [...customerKeys.lists(), { filters }] as const,
};

export const useGetCustomers = () => {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: () => Promise.resolve(mockCustomers),
  });
};
