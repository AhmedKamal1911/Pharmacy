import type { Purchase, PurchaseInvoice } from "../types";

export const purchasesMock: Purchase[] = [
  {
    id: "1",
    serialNumber: 1,
    invoiceNumber: "INV-001",
    invoiceDate: "2026-02-01",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    total: 5000,
    status: "PAID",
  },
  {
    id: "2",
    serialNumber: 2,
    invoiceNumber: "INV-002",
    invoiceDate: "2026-02-05",
    supplierId: "2",
    supplierName: "مستودع الأدوية المركزي",
    total: 3000,
    status: "PENDING",
  },
  {
    id: "3",
    serialNumber: 3,
    invoiceNumber: "INV-003",
    invoiceDate: "2026-02-06",
    supplierId: "1",
    supplierName: "مؤسسة الأدوية المتحدة",
    total: 1200,
    status: "OVERDUE",
  },
  {
    id: "4",
    serialNumber: 4,
    invoiceNumber: "INV-004",
    invoiceDate: "2026-02-08",
    supplierId: "3",
    supplierName: "أحمد محمد العلي",
    total: 8500,
    status: "PAID",
  },
  {
    id: "5",
    serialNumber: 5,
    invoiceNumber: "INV-005",
    invoiceDate: "2026-02-10",
    supplierId: "2",
    supplierName: "مستودع الأدوية المركزي",
    total: 4200,
    status: "PENDING",
  },
  {
    id: "6",
    serialNumber: 6,
    invoiceNumber: "INV-006",
    invoiceDate: "2026-01-25",
    supplierId: "4",
    supplierName: "شركة النور للتجارة",
    total: 6700,
    status: "OVERDUE",
  },
];

// Mock data for detailed invoice
export const mockPurchaseInvoice: PurchaseInvoice = {
  id: "1",
  invoiceNumber: "INV-001",
  invoiceDate: "2026-02-01",
  supplierId: "1",
  supplierName: "مؤسسة الأدوية المتحدة",
  notes: "فاتورة مشتريات أدوية أساسية للشهر",
  items: [
    {
      id: "1",
      medicineCode: "MED001",
      medicineName: "بانادول إكسترا",
      quantity: 100,
      unitsPerPackage: 24,
      salePrice: 45.5,
      tax: 14,
      mainDiscount: 5,
      extraDiscount: 2,
      cost: 35.2,
      expiryDate: "2028-12-31",
      bonus: 5,
      expirable: true,
    },
    {
      id: "2",
      medicineCode: "MED002",
      medicineName: "أوجمنتين 625 مجم",
      quantity: 50,
      unitsPerPackage: 14,
      salePrice: 85.0,
      tax: 14,
      mainDiscount: 3,
      cost: 72.5,
      expiryDate: "2027-08-15",
      expirable: true,
    },
    {
      id: "3",
      medicineCode: "MED003",
      medicineName: "فولتارين 50 مجم",
      quantity: 75,
      unitsPerPackage: 20,
      salePrice: 28.75,
      tax: 14,
      mainDiscount: 4,
      extraDiscount: 1,
      cost: 22.3,
      expiryDate: "2029-03-20",
      bonus: 3,
      expirable: true,
    },
  ],
  totals: {
    itemsValue: 8500,
    profitPercentage: 22.5,
    total: 5000,
    baseTotal: 4500,
    taxTotal: 700,
    extraCosts: 200,
    extraDiscount: 100,
  },
};

// Function to get invoice by ID
export const getPurchaseInvoiceById = (id: string): PurchaseInvoice | null => {
  if (id === "1") return mockPurchaseInvoice;
  return null;
};

// Function to delete a purchase
export const deletePurchase = (id: string): boolean => {
  const index = purchasesMock.findIndex((p) => p.id === id);
  if (index !== -1) {
    purchasesMock.splice(index, 1);
    return true;
  }
  return false;
};
