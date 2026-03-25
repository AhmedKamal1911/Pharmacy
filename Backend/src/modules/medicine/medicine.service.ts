import { MedicineRepository } from "./medicine.repository";
import { InsufficientStockError, NotFoundError } from "../../types";
import { toMoney, fromMoney, formatMoney } from "../../utils/currency";
import { isPast, isWithinDays } from "../../utils/date";

export class MedicineService {
  private repository = new MedicineRepository();

  /**
   * Create a new medicine
   */
  async createMedicine(data: {
    name: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    minStock: number;
    expiryDate?: Date | null;
    manufacturer?: string;
    barcode?: string;
  }) {
    // Validate business logic
    if (data.price < 0) {
      throw new Error("Price cannot be negative");
    }

    if (data.stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    if (data.minStock < 0) {
      throw new Error("Minimum stock cannot be negative");
    }

    // Check if medicine name already exists
    const existingMedicine = await this.repository.findByName(data.name);
    if (existingMedicine) {
      throw new Error("Medicine with this name already exists");
    }

    // Check if barcode already exists
    if (data.barcode) {
      const existingBarcode = await this.repository.findByBarcode(data.barcode);
      if (existingBarcode) {
        throw new Error("Medicine with this barcode already exists");
      }
    }

    return await this.repository.create(data);
  }

  /**
   * Get medicine by ID
   */
  async getMedicineById(id: string) {
    const medicine = await this.repository.findById(id);
    if (!medicine) {
      throw new NotFoundError("Medicine");
    }

    // Add computed properties
    return {
      ...medicine,
      isLowStock: medicine.stock <= medicine.minStock,
      isExpired: medicine.expiryDate ? isPast(medicine.expiryDate) : false,
      isExpiringSoon: medicine.expiryDate
        ? isWithinDays(medicine.expiryDate, 30)
        : false,
      formattedPrice: formatMoney(medicine.price),
    };
  }

  /**
   * Get all medicines with filtering and pagination
   */
  async getMedicines(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    lowStock?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const { medicines, total } = await this.repository.findMany({
      pagination: {
        page: params.page || 1,
        limit: params.limit || 20,
        sortBy: params.sortBy || "name",
        sortOrder: params.sortOrder || "asc",
      },
      category: params.category,
      search: params.search,
      lowStock: params.lowStock,
    });

    // Add computed properties
    const enrichedMedicines = medicines.map((medicine) => ({
      ...medicine,
      isLowStock: medicine.stock <= medicine.minStock,
      isExpired: medicine.expiryDate ? isPast(medicine.expiryDate) : false,
      isExpiringSoon: medicine.expiryDate
        ? isWithinDays(medicine.expiryDate, 30)
        : false,
      formattedPrice: formatMoney(medicine.price),
    }));

    const page = params.page || 1;
    const limit = params.limit || 20;
    const totalPages = Math.ceil(total / limit);

    return {
      medicines: enrichedMedicines,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Update medicine
   */
  async updateMedicine(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      category: string;
      price: number;
      stock: number;
      minStock: number;
      expiryDate: Date | null;
      manufacturer: string;
      barcode: string;
    }>,
  ) {
    const existingMedicine = await this.repository.findById(id);
    if (!existingMedicine) {
      throw new NotFoundError("Medicine");
    }

    // Validate business logic for updates
    if (data.price !== undefined && data.price < 0) {
      throw new Error("Price cannot be negative");
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    if (data.minStock !== undefined && data.minStock < 0) {
      throw new Error("Minimum stock cannot be negative");
    }

    // Check name uniqueness if updating name
    if (data.name && data.name !== existingMedicine.name) {
      const nameExists = await this.repository.findByName(data.name);
      if (nameExists) {
        throw new Error("Medicine with this name already exists");
      }
    }

    // Check barcode uniqueness if updating barcode
    if (data.barcode && data.barcode !== existingMedicine.barcode) {
      const barcodeExists = await this.repository.findByBarcode(data.barcode);
      if (barcodeExists) {
        throw new Error("Medicine with this barcode already exists");
      }
    }

    return await this.repository.update(id, data);
  }

  /**
   * Delete medicine (soft delete)
   */
  async deleteMedicine(id: string) {
    const existingMedicine = await this.repository.findById(id);
    if (!existingMedicine) {
      throw new NotFoundError("Medicine");
    }

    // Check if medicine has sales
    // This would require checking sale items - implement if needed
    // For now, we'll allow soft delete

    return await this.repository.softDelete(id);
  }

  /**
   * Adjust medicine stock
   */
  async adjustStock(data: {
    medicineId: string;
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    reason?: string;
    referenceId?: string;
  }) {
    const medicine = await this.repository.findById(data.medicineId);
    if (!medicine) {
      throw new NotFoundError("Medicine");
    }

    let newStock: number;

    switch (data.type) {
      case "IN":
        newStock = medicine.stock + data.quantity;
        break;
      case "OUT":
        if (medicine.stock < data.quantity) {
          throw new InsufficientStockError(
            medicine.name,
            data.quantity,
            medicine.stock,
          );
        }
        newStock = medicine.stock - data.quantity;
        break;
      case "ADJUSTMENT":
        newStock = data.quantity; // Set to exact value
        break;
      default:
        throw new Error("Invalid stock adjustment type");
    }

    // Use transaction to ensure data consistency
    const adjustmentPayload: {
      type: string;
      quantity: number;
      reason?: string;
      referenceId?: string;
    } = {
      type: data.type,
      quantity: data.quantity,
    };

    if (data.reason !== undefined) {
      adjustmentPayload.reason = data.reason;
    }
    if (data.referenceId !== undefined) {
      adjustmentPayload.referenceId = data.referenceId;
    }

    const result = await this.repository.updateStockWithTransaction(
      data.medicineId,
      newStock,
      adjustmentPayload,
    );

    return result;
  }

  /**
   * Get low stock medicines
   */
  async getLowStockMedicines() {
    const medicines = await this.repository.getLowStockMedicines();

    return medicines.map((medicine) => ({
      ...medicine,
      isExpired: medicine.expiryDate ? isPast(medicine.expiryDate) : false,
      isExpiringSoon: medicine.expiryDate
        ? isWithinDays(medicine.expiryDate, 30)
        : false,
      formattedPrice: formatMoney(medicine.price),
    }));
  }

  /**
   * Get medicines by category
   */
  async getMedicinesByCategory(category: string) {
    const medicines = await this.repository.findByCategory(category);

    return medicines.map((medicine) => ({
      ...medicine,
      isLowStock: medicine.stock <= medicine.minStock,
      isExpired: medicine.expiryDate ? isPast(medicine.expiryDate) : false,
      isExpiringSoon: medicine.expiryDate
        ? isWithinDays(medicine.expiryDate, 30)
        : false,
      formattedPrice: formatMoney(medicine.price),
    }));
  }

  /**
   * Search medicines by barcode
   */
  async searchByBarcode(barcode: string) {
    const medicine = await this.repository.findByBarcode(barcode);
    if (!medicine) {
      throw new NotFoundError("Medicine with this barcode");
    }

    return {
      ...medicine,
      isLowStock: medicine.stock <= medicine.minStock,
      isExpired: medicine.expiryDate ? isPast(medicine.expiryDate) : false,
      isExpiringSoon: medicine.expiryDate
        ? isWithinDays(medicine.expiryDate, 30)
        : false,
      formattedPrice: formatMoney(medicine.price),
    };
  }
}
