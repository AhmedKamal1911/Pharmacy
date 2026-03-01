import type {
  StockItem,
  StockStatus,
  StockSummary,
  CategoryDistribution,
} from "./types";

export const getStockStatus = (stock: number): StockStatus => {
  if (stock < 20) return "critical";
  if (stock < 30) return "low";
  if (stock < 100) return "normal";
  return "good";
};

export const calculateStockSummary = (data: StockItem[]): StockSummary => {
  const totalItems = data.length;
  const totalUnits = data.reduce((sum, item) => sum + item.currentStock, 0);
  const totalValue = data.reduce((sum, item) => sum + item.totalValue, 0);
  const averageValuePerItem = totalItems > 0 ? totalValue / totalItems : 0;

  return {
    totalItems,
    totalUnits,
    totalValue,
    averageValuePerItem,
  };
};

export const getCategoryDistribution = (
  data: StockItem[],
): CategoryDistribution[] => {
  const categories = Array.from(new Set(data.map((item) => item.category)));

  return categories.map((category) => {
    const categoryItems = data.filter((item) => item.category === category);
    const totalStock = categoryItems.reduce(
      (sum, item) => sum + item.currentStock,
      0,
    );
    const totalValue = categoryItems.reduce(
      (sum, item) => sum + item.totalValue,
      0,
    );

    return {
      category,
      itemCount: categoryItems.length,
      totalStock,
      totalValue,
    };
  });
};

export const filterAndSortData = (
  data: StockItem[],
  filters: {
    category: string;
    status: string;
    sortBy: string;
  },
): StockItem[] => {
  const filtered = data.filter((item) => {
    const categoryMatch =
      filters.category === "all" || item.category === filters.category;
    const statusMatch =
      filters.status === "all" || item.stockStatus === filters.status;
    return categoryMatch && statusMatch;
  });

  return filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "stock":
        return b.currentStock - a.currentStock;
      case "value":
        return b.totalValue - a.totalValue;
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });
};
