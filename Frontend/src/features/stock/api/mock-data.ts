import { medicines } from "@/data/medicines";
import type { StockItem } from "../types";

export const mockStockData: StockItem[] = medicines.map((medicine) => ({
  id: medicine.id,
  name: medicine.name,
  category: medicine.category,
  price: medicine.price,
  currentStock: medicine.stock,
  minStockLevel: Math.floor(Math.random() * 50) + 20,
  maxStockLevel: Math.floor(Math.random() * 300) + 100,
  reorderPoint: Math.floor(Math.random() * 30) + 10,
  averageMonthlySales: Math.floor(Math.random() * 100) + 20,
  lastRestockDate: new Date(
    Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("ar-EG"),
  supplier: `مورد ${Math.floor(Math.random() * 5) + 1}`,
  location: `مخزن ${Math.floor(Math.random() * 3) + 1} - رف ${Math.floor(Math.random() * 10) + 1}`,
  batchNumber: `B${Math.floor(Math.random() * 10000)}`,
  expiryDate: medicine.expiryDate || "N/A",
  totalValue: medicine.price * medicine.stock,
  stockStatus: getStockStatus(medicine.stock),
  turnoverRate: Math.random() * 10,
  daysOfSupply: Math.floor(medicine.stock / (Math.random() * 5 + 1)),
}));

function getStockStatus(stock: number): "critical" | "low" | "normal" | "good" {
  if (stock < 20) return "critical";
  if (stock < 50) return "low";
  if (stock < 100) return "normal";
  return "good";
}
