import type { Medicine, MedicineFilters } from "../types";
import { mockMedicines } from "./mock-data";

export const medicinesApi = {
  async getMedicines(filters?: MedicineFilters): Promise<Medicine[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredMedicines = mockMedicines;

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredMedicines = filteredMedicines.filter(
        (med) =>
          med.name.toLowerCase().includes(searchLower) ||
          med.code?.toLowerCase().includes(searchLower) ||
          med.category.toLowerCase().includes(searchLower),
      );
    }

    if (filters?.category) {
      filteredMedicines = filteredMedicines.filter(
        (med) => med.category === filters.category,
      );
    }

    if (filters?.minStock) {
      filteredMedicines = filteredMedicines.filter((med) =>
        med.variants.some((variant) => variant.stock <= (med.minStock || 0)),
      );
    }

    return filteredMedicines;
  },

  async createMedicine(
    medicine: Omit<Medicine, "id" | "createdAt" | "updatedAt">,
  ): Promise<Medicine> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newMedicine: Medicine = {
      ...medicine,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockMedicines.push(newMedicine);
    return newMedicine;
  },

  async updateMedicine(
    id: string,
    updates: Partial<Medicine>,
  ): Promise<Medicine> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockMedicines.findIndex((med) => med.id === id);
    if (index === -1) {
      throw new Error("Medicine not found");
    }

    mockMedicines[index] = {
      ...mockMedicines[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return mockMedicines[index];
  },

  async deleteMedicine(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockMedicines.findIndex((med) => med.id === id);
    if (index === -1) {
      throw new Error("Medicine not found");
    }

    mockMedicines.splice(index, 1);
  },
};
