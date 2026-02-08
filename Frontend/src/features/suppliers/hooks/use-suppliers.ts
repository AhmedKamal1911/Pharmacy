import { useState } from "react";
import type { Supplier } from "../types";
import { mockSuppliers } from "../api/mock-data";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const addSupplier = (newSupplier: Supplier) => {
    setIsLoading(true);
    try {
      setSuppliers((prev) => [newSupplier, ...prev]);
      setIsError(false);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id ? { ...supplier, ...updates } : supplier,
      ),
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  };

  return {
    suppliers,
    isLoading,
    isError,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  };
}
