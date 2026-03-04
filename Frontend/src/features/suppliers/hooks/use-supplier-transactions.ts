import { useState, useMemo } from "react";
import type {
  SupplierTransaction,
  TransactionFilter,
  TransactionSummary,
  PaymentRecord,
} from "../types/transactions";

// Mock data for demonstration
const mockTransactions: SupplierTransaction[] = [
  {
    id: "1",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    type: "PURCHASE",
    status: "COMPLETED",
    description: "شراء أدوية ومستلزمات طبية",
    amount: 15000,
    balanceBefore: 5000,
    balanceAfter: 20000,
    referenceId: "purchase-1",
    referenceType: "PURCHASE",
    transactionDate: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    notes: "فاتورة شراء شهر يناير - أدوية مزيلة للسعال",
    createdBy: "admin",
  },
  {
    id: "2",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    type: "PAYMENT",
    status: "COMPLETED",
    description: "سداد فاتورة رقم 123",
    amount: -8000,
    balanceBefore: 20000,
    balanceAfter: 12000,
    referenceId: "payment-1",
    referenceType: "PAYMENT",
    transactionDate: "2024-01-20T14:00:00Z",
    createdAt: "2024-01-20T14:00:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
    notes: "دفعة نقدية جزئية",
    createdBy: "admin",
  },
  {
    id: "3",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    type: "RETURN",
    status: "COMPLETED",
    description: "مرتجع أدوية منتهية الصلاحية",
    amount: -2000,
    balanceBefore: 12000,
    balanceAfter: 10000,
    referenceId: "return-1",
    referenceType: "RETURN",
    transactionDate: "2024-01-25T11:15:00Z",
    createdAt: "2024-01-25T11:15:00Z",
    updatedAt: "2024-01-25T11:15:00Z",
    notes: "مرتجع لانتهاء الصلاحية - 5 صناديق",
    createdBy: "admin",
  },
  {
    id: "4",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    type: "WITHDRAWAL",
    status: "COMPLETED",
    description: "سحب بضاعة على الحساب",
    amount: 3500,
    balanceBefore: 10000,
    balanceAfter: 13500,
    referenceId: "withdrawal-1",
    referenceType: "WITHDRAWAL",
    transactionDate: "2024-02-01T09:30:00Z",
    createdAt: "2024-02-01T09:30:00Z",
    updatedAt: "2024-02-01T09:30:00Z",
    notes: "سحب طلبية عاجلة - مضادات حيوية",
    createdBy: "admin",
  },
  {
    id: "5",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    type: "DISCOUNT",
    status: "COMPLETED",
    description: "خصم على المشتريات الكمية",
    amount: -750,
    balanceBefore: 13500,
    balanceAfter: 12750,
    referenceId: "discount-1",
    referenceType: "DISCOUNT",
    transactionDate: "2024-02-05T15:00:00Z",
    createdAt: "2024-02-05T15:00:00Z",
    updatedAt: "2024-02-05T15:00:00Z",
    notes: "خصم 5% على المشتريات الكمية",
    createdBy: "admin",
  },
  {
    id: "6",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    type: "CREDIT_NOTE",
    status: "COMPLETED",
    description: "إشعار دائن - خطأ في الفاتورة",
    amount: -500,
    balanceBefore: 12750,
    balanceAfter: 12250,
    referenceId: "credit-1",
    referenceType: "CREDIT_NOTE",
    transactionDate: "2024-02-10T11:00:00Z",
    createdAt: "2024-02-10T11:00:00Z",
    updatedAt: "2024-02-10T11:00:00Z",
    notes: "تصحيح خطأ في الفاتورة السابقة",
    createdBy: "admin",
  },
  {
    id: "7",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    type: "DEBIT_NOTE",
    status: "COMPLETED",
    description: "إشارة مدين - رسوم توصيل",
    amount: 200,
    balanceBefore: 12250,
    balanceAfter: 12450,
    referenceId: "debit-1",
    referenceType: "DEBIT_NOTE",
    transactionDate: "2024-02-12T14:20:00Z",
    createdAt: "2024-02-12T14:20:00Z",
    updatedAt: "2024-02-12T14:20:00Z",
    notes: "رسوم توصيل إضافية",
    createdBy: "admin",
  },
  {
    id: "8",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    type: "PENALTY",
    status: "COMPLETED",
    description: "غرامة تأخير السداد",
    amount: 300,
    balanceBefore: 12450,
    balanceAfter: 12750,
    referenceId: "penalty-1",
    referenceType: "PENALTY",
    transactionDate: "2024-02-15T16:45:00Z",
    createdAt: "2024-02-15T16:45:00Z",
    updatedAt: "2024-02-15T16:45:00Z",
    notes: "غرامة 2% على التأخير في السداد",
    createdBy: "admin",
  },
  {
    id: "9",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    type: "SETTLEMENT",
    status: "COMPLETED",
    description: "تسوية حساب شهرية",
    amount: -12750,
    balanceBefore: 12750,
    balanceAfter: 0,
    referenceId: "settlement-1",
    referenceType: "SETTLEMENT",
    transactionDate: "2024-02-20T10:00:00Z",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z",
    notes: "تسوية كاملة للحساب الشهري",
    createdBy: "admin",
  },
  {
    id: "10",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    type: "ADJUSTMENT",
    status: "COMPLETED",
    description: "تعديل في الحساب - تصحيح أخطاء",
    amount: -150,
    balanceBefore: 0,
    balanceAfter: -150,
    referenceId: "adjustment-1",
    referenceType: "ADJUSTMENT",
    transactionDate: "2024-02-22T13:30:00Z",
    createdAt: "2024-02-22T13:30:00Z",
    updatedAt: "2024-02-22T13:30:00Z",
    notes: "تصحيح خطأ في الحسابات",
    createdBy: "admin",
  },
];

const mockPayments: PaymentRecord[] = [
  {
    id: "payment-1",
    supplierId: "1",
    amount: 8000,
    paymentMethod: "CASH",
    paymentDate: "2024-01-20T14:00:00Z",
    notes: "دفعة نقدية",
    status: "PAID",
    createdAt: "2024-01-20T14:00:00Z",
  },
  {
    id: "payment-2",
    supplierId: "2",
    amount: 15000,
    paymentMethod: "CHECK",
    paymentDate: "2024-02-10T16:30:00Z",
    checkNumber: "12345",
    bankName: "Banque Misr",
    notes: "شيك بنكي",
    status: "PAID",
    createdAt: "2024-02-10T16:30:00Z",
  },
  {
    id: "payment-3",
    supplierId: "3",
    amount: 8000,
    paymentMethod: "CASH",
    paymentDate: "2024-02-10T12:00:00Z",
    notes: "تسوية كاملة",
    status: "PAID",
    createdAt: "2024-02-10T12:00:00Z",
  },
];

export function useSupplierTransactions(supplierId?: string) {
  const [transactions, setTransactions] =
    useState<SupplierTransaction[]>(mockTransactions);
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [filter, setFilter] = useState<TransactionFilter>({});

  // Filter transactions based on current filter and supplierId
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filter by supplier if specified
      if (supplierId && transaction.supplierId !== supplierId) {
        return false;
      }

      // Filter by transaction type
      if (
        filter.transactionType &&
        transaction.type !== filter.transactionType
      ) {
        return false;
      }

      // Filter by status
      if (filter.status && transaction.status !== filter.status) {
        return false;
      }

      // Filter by date range
      if (filter.startDate) {
        const transactionDate = new Date(transaction.transactionDate);
        const startDate = new Date(filter.startDate);
        if (transactionDate < startDate) {
          return false;
        }
      }

      if (filter.endDate) {
        const transactionDate = new Date(transaction.transactionDate);
        const endDate = new Date(filter.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        if (transactionDate > endDate) {
          return false;
        }
      }

      // Filter by amount range
      if (
        filter.minAmount !== undefined &&
        Math.abs(transaction.amount) < filter.minAmount
      ) {
        return false;
      }

      if (
        filter.maxAmount !== undefined &&
        Math.abs(transaction.amount) > filter.maxAmount
      ) {
        return false;
      }

      return true;
    });
  }, [transactions, filter, supplierId]);

  // Calculate transaction summary
  const transactionSummary = useMemo((): TransactionSummary => {
    const supplierTransactions = supplierId
      ? transactions.filter((t) => t.supplierId === supplierId)
      : transactions;

    const filteredForSummary = supplierTransactions.filter((transaction) => {
      if (filter.startDate) {
        const transactionDate = new Date(transaction.transactionDate);
        const startDate = new Date(filter.startDate);
        if (transactionDate < startDate) return false;
      }

      if (filter.endDate) {
        const transactionDate = new Date(transaction.transactionDate);
        const endDate = new Date(filter.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (transactionDate > endDate) return false;
      }

      return true;
    });

    const purchases = filteredForSummary.filter((t) => t.type === "PURCHASE");
    const payments = filteredForSummary.filter((t) => t.type === "PAYMENT");
    const returns = filteredForSummary.filter((t) => t.type === "RETURN");
    const adjustments = filteredForSummary.filter(
      (t) => t.type === "ADJUSTMENT",
    );

    const totalPurchases = purchases.reduce((sum, t) => sum + t.amount, 0);
    const totalPayments = payments.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0,
    );
    const totalReturns = returns.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0,
    );

    // Get current balance (latest transaction for this supplier)
    const currentBalance = supplierId
      ? supplierTransactions.sort(
          (a, b) =>
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime(),
        )[0]?.balanceAfter || 0
      : 0;

    return {
      totalTransactions: filteredForSummary.length,
      totalPurchases,
      totalPayments,
      totalReturns,
      currentBalance,
      averageTransactionValue:
        filteredForSummary.length > 0
          ? filteredForSummary.reduce((sum, t) => sum + Math.abs(t.amount), 0) /
            filteredForSummary.length
          : 0,
      purchasesCount: purchases.length,
      paymentsCount: payments.length,
      returnsCount: returns.length,
      adjustmentsCount: adjustments.length,
      periodPurchases: totalPurchases,
      periodPayments: totalPayments,
      periodReturns: totalReturns,
    };
  }, [transactions, filter, supplierId]);

  const updateFilter = (newFilter: Partial<TransactionFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const clearFilter = () => {
    setFilter({});
  };

  const addTransaction = (
    transaction: Omit<SupplierTransaction, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newTransaction: SupplierTransaction = {
      ...transaction,
      id: `transaction-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const addPayment = (payment: Omit<PaymentRecord, "id" | "createdAt">) => {
    const newPayment: PaymentRecord = {
      ...payment,
      id: `payment-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);
  };

  return {
    transactions: filteredTransactions,
    payments,
    summary: transactionSummary,
    isLoading: false,
    isError: false,
    filter,
    updateFilter,
    clearFilter,
    addTransaction,
    addPayment,
  };
}
