// حالة الفاتورة
export type PurchaseStatus = "PAID" | "PENDING" | "OVERDUE";

// نوع بيانات فاتورة واحدة في جدول المشتريات
export interface Purchase {
  id: string; // معرف داخلي للفاتورة
  serialNumber: number; // المسلسل في الجدول
  invoiceNumber: string; // رقم الفاتورة
  invoiceDate: string; // تاريخ الفاتورة (ISO string)
  supplierId: string; // معرف المورد
  supplierName: string; // اسم المورد
  total: number; // المجموع الكلي للفاتورة
  status: PurchaseStatus; // حالة الفاتورة
}

// بيانات الفاتورة التفصيلية
export interface PurchaseInvoice {
  id: string; // معرف داخلي للفاتورة
  invoiceNumber: string; // رقم الفاتورة
  invoiceDate: string; // تاريخ الفاتورة
  supplierId: string; // المورد
  supplierName: string; // اسم المورد الأساسي (مثلا Glaxo Egypt)
  notes?: string; // ملاحظات على الفاتورة
  items: PurchaseItem[]; // الأصناف داخل الفاتورة
  totals: InvoiceTotals; // مجموعات وأرقام
}

// بيانات كل صنف في الفاتورة
export interface PurchaseItem {
  id: string;

  medicineId: string; // ✅ الربط الحقيقي بالصنف
  medicineName: string; // للعرض فقط (snapshot وقت الفاتورة)
  medicineCode?: string; // كود الصنف (اختياري)

  quantity: number;
  unitsPerPackage: number;

  salePrice: number;
  tax: number;

  mainDiscount: number;
  extraDiscount: number;

  cost: number;

  expiryDate?: string;

  bonus: number;

  expirable: boolean;
}

// بيانات المجموعات
export interface InvoiceTotals {
  itemsValue: number; // قيمة الأصناف البيعية
  profitPercentage: number; // نسبة الربح
  total: number; // المجموع الكلي
  baseTotal: number; // المجموع الأساسي
  taxTotal: number; // إجمالي الضريبة
  extraCosts?: number; // تكاليف إضافية
  extraDiscount?: number; // خصم إضافي
}
