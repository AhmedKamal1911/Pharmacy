// Types for supplier transactions and financial operations

export type TransactionType =
  | "PURCHASE" // شراء من المورد
  | "PAYMENT" // دفعة للمورد (سداد فاتورة)
  | "RETURN" // مرتجع للمورد
  | "ADJUSTMENT" // تعديل في الحساب
  | "SETTLEMENT" // تسوية حساب
  | "WITHDRAWAL" // سحب بضاعة/منتجات
  | "DISCOUNT" // خصم على المشتريات
  | "PENALTY" // غرامة/رسوم تأخير
  | "CREDIT_NOTE" // إشعار دائن
  | "DEBIT_NOTE"; // إشارة مدين

export type TransactionStatus = "COMPLETED" | "PENDING" | "CANCELLED";

export interface SupplierTransaction {
  id: string;
  supplierId: string;
  supplierName: string;

  // Transaction details
  type: TransactionType;
  status: TransactionStatus;
  description: string;

  // Financial details
  amount: number;
  balanceBefore: number;
  balanceAfter: number;

  // Reference to related documents
  referenceId?: string; // Purchase ID, Payment ID, etc.
  referenceType?: string; // "PURCHASE", "PAYMENT", etc.

  // Dates
  transactionDate: string;
  createdAt: string;
  updatedAt: string;

  // Additional metadata
  notes?: string;
  createdBy?: string;
}

export interface TransactionFilter {
  supplierId?: string;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionSummary {
  totalTransactions: number;
  totalPurchases: number;
  totalPayments: number;
  totalReturns: number;
  currentBalance: number;
  averageTransactionValue: number;

  // Breakdown by type
  purchasesCount: number;
  paymentsCount: number;
  returnsCount: number;
  adjustmentsCount: number;

  // Period totals
  periodPurchases: number;
  periodPayments: number;
  periodReturns: number;
}

export interface PaymentRecord {
  id: string;
  supplierId: string;
  amount: number;
  paymentMethod: "CASH" | "CHECK" | "BANK_TRANSFER" | "CREDIT";
  paymentDate: string;
  dueDate?: string;
  checkNumber?: string;
  bankName?: string;
  notes?: string;
  status: "PAID" | "PENDING" | "BOUNCED";
  createdAt: string;
}
