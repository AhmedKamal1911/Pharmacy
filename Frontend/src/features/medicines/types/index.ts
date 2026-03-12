export interface MedicineVariant {
  id: string;
  price: number;
  cost: number;
  stock: number;
  expiryDate?: string;
  batchNumber?: string;
}

export interface Medicine {
  id: string;
  name: string;
  code?: string;
  category: string;
  description?: string;
  basePrice?: number; // السعر الأساسي للصنف
  cost?: number; // تكلفة الشراء الأساسية
  unit?: string; // الوحدة (مثال: علبة، زجاجة)
  minStock?: number; // الحد الأدنى للمخزون
  variants: MedicineVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicineFilters {
  search?: string;
  category?: string;
  minStock?: boolean;
}

export interface MedicineFormData {
  name: string;
  code?: string;
  category: string;
  description?: string;
  cost: number;
  unit: string;
  minStock: number;
  basePrice: number;
  variants: Omit<MedicineVariant, "id">[];
}
