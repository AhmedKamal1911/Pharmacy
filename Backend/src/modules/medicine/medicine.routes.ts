import { Router } from 'express';
import { MedicineController } from './medicine.controller';
import { validateRequest } from '../../middlewares/validation.middleware';
import {
  createMedicineSchema,
  updateMedicineSchema,
  medicineParamsSchema,
  medicineQuerySchema,
  stockAdjustmentSchema,
} from './medicine.validators';

const router = Router();
const medicineController = new MedicineController();

// CRUD routes
router.post(
  '/',
  validateRequest({ body: createMedicineSchema }),
  medicineController.createMedicine
);

router.get(
  '/',
  validateRequest({ query: medicineQuerySchema }),
  medicineController.getMedicines
);

router.get(
  '/low-stock',
  medicineController.getLowStockMedicines
);

router.get(
  '/category/:category',
  medicineController.getMedicinesByCategory
);

router.get(
  '/barcode/:barcode',
  medicineController.searchByBarcode
);

router.get(
  '/:id',
  validateRequest({ params: medicineParamsSchema }),
  medicineController.getMedicineById
);

router.put(
  '/:id',
  validateRequest({ 
    params: medicineParamsSchema,
    body: updateMedicineSchema 
  }),
  medicineController.updateMedicine
);

router.delete(
  '/:id',
  validateRequest({ params: medicineParamsSchema }),
  medicineController.deleteMedicine
);

// Stock management routes
router.post(
  '/stock/adjust',
  validateRequest({ body: stockAdjustmentSchema }),
  medicineController.adjustStock
);

export default router;
