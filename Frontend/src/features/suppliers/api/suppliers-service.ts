import { useQuery } from "@tanstack/react-query";
import { mockSuppliers } from "./mock-data";

export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  list: () => [...supplierKeys.lists()] as const,
};

export const useGetSuppliers = () => {
  return useQuery({
    queryKey: supplierKeys.lists(),
    queryFn: () => Promise.resolve(mockSuppliers),
  });
};
