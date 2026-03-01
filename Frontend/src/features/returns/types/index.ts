export type ReturnType = "sales_return" | "purchases_return";
export type PaymentMethod = "cash" | "visa" | "credit";
export type ReturnStatus = "completed" | "pending" | "cancelled";

export interface ReturnFilters {
  search?: string;
  type?: ReturnType;
  status?: ReturnStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
}

export interface ReturnInvoice {
  id: string;
  invoiceNumber: string;
  originalInvoiceNumber: string;
  
  type: ReturnType;
  date: string;
  
  entityName: string;
  entityId?: string;
  
  totalAmount: number;
  paymentMethod: PaymentMethod;
  
  createdBy: string;
  
  reason?: string;
  status: ReturnStatus;
}

export interface ReturnItem {
  id: string;
  medicineId: string;
  medicineCode: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}
