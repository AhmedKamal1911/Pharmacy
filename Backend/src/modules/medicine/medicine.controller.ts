import { Request, Response } from 'express';
import { MedicineService } from './medicine.service';
import { asyncWrapper } from '../../middlewares/error.middleware';
import { CreateMedicineInput, UpdateMedicineInput, MedicineParams, MedicineQuery, StockAdjustmentInput } from './medicine.validators';

const medicineService = new MedicineService();

export class MedicineController {
  /**
   * Create a new medicine
   */
  createMedicine = asyncWrapper(async (req: Request, res: Response) => {
    const medicineData: CreateMedicineInput = req.body;
    const medicine = await medicineService.createMedicine(medicineData);

    res.status(201).json({
      success: true,
      message: 'Medicine created successfully',
      data: medicine,
    });
  });

  /**
   * Get medicine by ID
   */
  getMedicineById = asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params as MedicineParams;
    const medicine = await medicineService.getMedicineById(id);

    res.json({
      success: true,
      message: 'Medicine retrieved successfully',
      data: medicine,
    });
  });

  /**
   * Get all medicines with filtering and pagination
   */
  getMedicines = asyncWrapper(async (req: Request, res: Response) => {
    const query = req.query as MedicineQuery;
    const result = await medicineService.getMedicines(query);

    res.json({
      success: true,
      message: 'Medicines retrieved successfully',
      data: result.medicines,
      pagination: result.pagination,
    });
  });

  /**
   * Update medicine
   */
  updateMedicine = asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params as MedicineParams;
    const updateData: UpdateMedicineInput = req.body;
    const medicine = await medicineService.updateMedicine(id, updateData);

    res.json({
      success: true,
      message: 'Medicine updated successfully',
      data: medicine,
    });
  });

  /**
   * Delete medicine (soft delete)
   */
  deleteMedicine = asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params as MedicineParams;
    await medicineService.deleteMedicine(id);

    res.json({
      success: true,
      message: 'Medicine deleted successfully',
    });
  });

  /**
   * Adjust medicine stock
   */
  adjustStock = asyncWrapper(async (req: Request, res: Response) => {
    const adjustmentData: StockAdjustmentInput = req.body;
    const result = await medicineService.adjustStock(adjustmentData);

    res.json({
      success: true,
      message: 'Stock adjusted successfully',
      data: result,
    });
  });

  /**
   * Get low stock medicines
   */
  getLowStockMedicines = asyncWrapper(async (req: Request, res: Response) => {
    const medicines = await medicineService.getLowStockMedicines();

    res.json({
      success: true,
      message: 'Low stock medicines retrieved successfully',
      data: medicines,
    });
  });

  /**
   * Get medicines by category
   */
  getMedicinesByCategory = asyncWrapper(async (req: Request, res: Response) => {
    const { category } = req.params;
    const medicines = await medicineService.getMedicinesByCategory(category);

    res.json({
      success: true,
      message: `Medicines in category '${category}' retrieved successfully`,
      data: medicines,
    });
  });

  /**
   * Search medicine by barcode
   */
  searchByBarcode = asyncWrapper(async (req: Request, res: Response) => {
    const { barcode } = req.params;
    const medicine = await medicineService.searchByBarcode(barcode);

    res.json({
      success: true,
      message: 'Medicine found by barcode',
      data: medicine,
    });
  });
}
