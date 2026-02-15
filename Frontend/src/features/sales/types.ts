export interface SalesStats {
  bestSellingMedicine: {
    name: string;
    sales: number;
    unit: string;
  };
  lowStockItems: number;
  expiringItems: number;
  totalStock: number;
  todaySales: number;
  todayProfit: number;
  todayInvoices: number;
}
