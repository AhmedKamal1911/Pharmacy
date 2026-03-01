import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StockSummaryCards } from "./stock-summary-cards";
import { StockCategoryDistribution } from "./stock-category-distribution";
import { StockTable } from "../table/stock-table";
import { useGetStock } from "../../api/stock-service";
import {
  calculateStockSummary,
  getCategoryDistribution,
  filterAndSortData,
} from "../../utils";

export function StockOverview() {
  const { data: stockData = [] } = useGetStock();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredData = useMemo(() => {
    let filtered = filterAndSortData(stockData, {
      category: selectedCategory,
      status: selectedStatus,
      sortBy,
    });

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [stockData, selectedCategory, selectedStatus, sortBy, searchQuery]);

  const summary = useMemo(() => calculateStockSummary(stockData), [stockData]);
  const categoryDistribution = useMemo(
    () => getCategoryDistribution(stockData),
    [stockData],
  );

  const handleReset = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSortBy("name");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen ">
      <div className="flex flex-col gap-10">
        <PageHeader
          title="إجمالي المخزون"
          description="عرض كامل المخزون مع التحليل والإحصائيات التفصيلية"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StockSummaryCards
            summary={summary}
            filteredItemsCount={filteredData.length}
          />
        </div>
      </div>

      <div className="mb-8">
        <StockCategoryDistribution distribution={categoryDistribution} />
      </div>

      {/* Table with integrated filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <StockTable
          data={filteredData}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          sortBy={sortBy}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          onSortChange={setSortBy}
          onSearchChange={setSearchQuery}
          onReset={handleReset}
          allData={stockData}
        />
      </div>
    </div>
  );
}
