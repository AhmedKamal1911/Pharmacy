// types/supplier.ts

// =====================
// نوع المورد
// =====================
export type SupplierType = "WAREHOUSE" | "COMPANY" | "PERSON";

// =====================
// حالة المديونية
// =====================
export type SupplierDebitStatus = "PAID" | "DUE" | "OVERDUE";
// =====================
// بيانات المورد
// =====================
export interface Supplier {
  id: string;

  // بيانات أساسية
  short: string; // الاختصار (مثال: ACD)
  name: string;
  supplierType: SupplierType;

  // مالية
  debit: number; // المديونية
  debitStatus?: SupplierDebitStatus; // حالة المديونية
  paymentPeriodMonths: number; // فترة الأجل (بالشهور)

  // تواصل
  landlinePhone?: string; // التليفون الأرضي
  mobilePhone: string; // التليفون المحمول

  // تواريخ
  settlementDate?: string; // تاريخ التقفيل (ISO string)
  checksDueDate?: string; // تاريخ سداد الشيكات (ISO string)

  // نظام
  createdAt: string;
  updatedAt: string;
}

// =====================
// سجل تعديل المديونية
// =====================
export interface SupplierDebitLog {
  id: string;
  supplierId: string;

  oldDebit: number;
  newDebit: number;
  changeValue: number;

  reason: string;

  createdAt: string;
}
