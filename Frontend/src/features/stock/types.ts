export type StockStatus = "critical" | "low" | "normal" | "good";

export interface StockItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  averageMonthlySales: number;
  lastRestockDate: string;
  supplier: string;
  location: string;
  batchNumber: string;
  expiryDate: string;
  totalValue: number;
  stockStatus: StockStatus;
  turnoverRate: number;
  daysOfSupply: number;
}

export interface StockFilters {
  category: string;
  status: string;
  sortBy: string;
}

export interface StockSummary {
  totalItems: number;
  totalUnits: number;
  totalValue: number;
  averageValuePerItem: number;
}

export interface CategoryDistribution {
  category: string;
  itemCount: number;
  totalStock: number;
  totalValue: number;
}
