import { useState } from "react";
import type { Customer } from "../types";
import { mockCustomers } from "../api/mock-data";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const addCustomer = (newCustomer: Customer) => {
    setIsLoading(true);
    try {
      setCustomers((prev) => [newCustomer, ...prev]);
      setIsError(false);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id ? { ...customer, ...updates } : customer,
      ),
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  return {
    customers,
    isLoading,
    isError,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
