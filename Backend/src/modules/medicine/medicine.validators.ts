import { z } from 'zod';

/**
 * Medicine validation schemas
 */

export const createMedicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required').max(255, 'Name too long'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required').max(100, 'Category too long'),
  price: z.number().int().min(0, 'Price must be non-negative'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  minStock: z.number().int().min(0, 'Minimum stock must be non-negative'),
  expiryDate: z.string().datetime().optional().nullable(),
  manufacturer: z.string().max(255, 'Manufacturer name too long').optional(),
  barcode: z.string().max(100, 'Barcode too long').optional(),
});

export const updateMedicineSchema = createMedicineSchema.partial();

export const medicineParamsSchema = z.object({
  id: z.string().cuid('Invalid medicine ID'),
});

export const medicineQuerySchema = z.object({
  page: z.string().optional().transform(Number).pipe(z.number().int().min(1)),
  limit: z.string().optional().transform(Number).pipe(z.number().int().min(1).max(100)),
  category: z.string().optional(),
  search: z.string().optional(),
  lowStock: z.string().optional().transform(val => val === 'true'),
  sortBy: z.enum(['name', 'category', 'price', 'stock', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const stockAdjustmentSchema = z.object({
  medicineId: z.string().cuid('Invalid medicine ID'),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
  quantity: z.number().int().min(1, 'Quantity must be positive'),
  reason: z.string().optional(),
});

export type CreateMedicineInput = z.infer<typeof createMedicineSchema>;
export type UpdateMedicineInput = z.infer<typeof updateMedicineSchema>;
export type MedicineParams = z.infer<typeof medicineParamsSchema>;
export type MedicineQuery = z.infer<typeof medicineQuerySchema>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
