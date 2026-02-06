export type CustomerType = "فرد" | "شركة";

export interface Loyalty {
  id: string;
  pointsPerCurrency: number;
  totalPoints: number;
  pendingPoints: number;
}

export interface CustomerFilters {
  search?: string;
  type?: CustomerType;
  isCashOnly?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  type: CustomerType;
  isCashOnly: boolean;
  balance: number;
  creditLimit: number;
  localDiscount: number;
  importDiscount: number;
  lastTransactionAt?: string;
  loyalty?: Loyalty;
}

// TODO: add عملاء فرعيين و الجزء المرحل
