import { prisma } from "../../database";
import { Medicine } from "@prisma/client";
import { PaginationParams } from "../../types";

export type MedicineWithStock = Medicine & {
  isLowStock: boolean;
};

export class MedicineRepository {
  /**
   * Create a new medicine
   */
  async create(data: {
    name: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    minStock: number;
    expiryDate?: Date | null;
    manufacturer?: string;
    barcode?: string;
  }): Promise<Medicine> {
    return await prisma.medicine.create({
      data,
    });
  }

  /**
   * Get medicine by ID
   */
  async findById(id: string): Promise<Medicine | null> {
    return await prisma.medicine.findUnique({
      where: { id, deletedAt: null },
    });
  }

  /**
   * Get medicine by name
   */
  async findByName(name: string): Promise<Medicine | null> {
    return await prisma.medicine.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        deletedAt: null,
      },
    });
  }

  /**
   * Get medicine by barcode
   */
  async findByBarcode(barcode: string): Promise<Medicine | null> {
    return await prisma.medicine.findUnique({
      where: { barcode, deletedAt: null },
    });
  }

  /**
   * Get all medicines with pagination and filtering
   */
  async findMany(params: {
    pagination?: PaginationParams;
    category?: string;
    search?: string;
    lowStock?: boolean;
  }): Promise<{ medicines: MedicineWithStock[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      sortBy = "name",
      sortOrder = "asc",
    } = params.pagination || {};

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      deletedAt: null,
    };

    if (params.category) {
      where.category = {
        contains: params.category,
        mode: "insensitive",
      };
    }

    if (params.search) {
      where.OR = [
        {
          name: {
            contains: params.search,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: params.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: params.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (params.lowStock) {
      where.stock = {
        lte: prisma.medicine.fields.minStock,
      };
    }

    // Get medicines
    const medicines = await prisma.medicine.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    // Get total count
    const total = await prisma.medicine.count({ where });

    // Add low stock indicator
    const medicinesWithStock = medicines.map((medicine) => ({
      ...medicine,
      isLowStock: medicine.stock <= medicine.minStock,
    }));

    return {
      medicines: medicinesWithStock,
      total,
    };
  }

  /**
   * Update medicine
   */
  async update(id: string, data: Partial<Medicine>): Promise<Medicine> {
    return await prisma.medicine.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  /**
   * Soft delete medicine
   */
  async softDelete(id: string): Promise<Medicine> {
    return await prisma.medicine.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Get low stock medicines
   */
  async getLowStockMedicines(): Promise<MedicineWithStock[]> {
    const medicines = await prisma.medicine.findMany({
      where: {
        deletedAt: null,
        stock: {
          lte: prisma.medicine.fields.minStock,
        },
      },
      orderBy: { stock: "asc" },
    });

    return medicines.map((medicine) => ({
      ...medicine,
      isLowStock: true,
    }));
  }

  /**
   * Get medicines by category
   */
  async findByCategory(category: string): Promise<Medicine[]> {
    return await prisma.medicine.findMany({
      where: {
        category: {
          contains: category,
          mode: "insensitive",
        },
        deletedAt: null,
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Update medicine stock (used in transactions)
   */
  async updateStock(id: string, newStock: number): Promise<Medicine> {
    return await prisma.medicine.update({
      where: { id },
      data: {
        stock: newStock,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Update medicine stock with transaction and create adjustment record
   */
  async updateStockWithTransaction(
    medicineId: string,
    newStock: number,
    adjustmentData: {
      type: string;
      quantity: number;
      reason?: string;
      referenceId?: string;
    },
  ): Promise<Medicine> {
    return await prisma.$transaction(async (tx: any) => {
      // Update medicine stock
      const updatedMedicine = await tx.medicine.update({
        where: { id: medicineId },
        data: {
          stock: newStock,
          updatedAt: new Date(),
        },
      });

      // Create stock adjustment record
      await tx.stockAdjustment.create({
        data: {
          medicineId,
          ...adjustmentData,
        },
      });

      return updatedMedicine;
    });
  }

  /**
   * Create stock adjustment record
   */
  async createStockAdjustment(data: {
    medicineId: string;
    type: string;
    quantity: number;
    reason?: string;
    referenceId?: string;
  }) {
    return await prisma.stockAdjustment.create({
      data,
    });
  }

  /**
   * Get stock adjustments for a medicine
   */
  async getStockAdjustments(medicineId: string, limit: number = 50) {
    return await prisma.stockAdjustment.findMany({
      where: { medicineId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
