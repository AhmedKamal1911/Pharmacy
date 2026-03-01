import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw, Filter } from "lucide-react";
import type { StockItem } from "../../types";

interface StockFiltersProps {
  selectedCategory: string;
  selectedStatus: string;
  sortBy: string;
  searchQuery: string;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  data: StockItem[];
}

export function StockFilters({
  selectedCategory,
  selectedStatus,
  sortBy,
  searchQuery,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onSearchChange,
  onReset,
  data,
}: StockFiltersProps) {
  const categories = Array.from(new Set(data.map((item) => item.category)));

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md">
            <Filter className="h-3.5 w-3.5" />
            <span className="font-medium text-sm">البحث والتصفية</span>
          </div>
          <div className="text-xs text-gray-600 font-medium">
            {data.length} منتج
          </div>
        </div>

        {/* Active Filters Indicator */}
        {(selectedCategory !== "all" ||
          selectedStatus !== "all" ||
          searchQuery) && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">فلاتر نشطة:</span>
            <div className="flex gap-0.5">
              {selectedCategory !== "all" && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  فئة
                </span>
              )}
              {selectedStatus !== "all" && (
                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  حالة
                </span>
              )}
              {searchQuery && (
                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  بحث
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters Row */}
      <div className="flex gap-2 flex-wrap">
        {/* Search - takes more space */}
        <div className="col-span-12 lg:col-span-5">
          <div className="relative">
            <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="ابحث عن اسم الدواء..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="col-span-6 sm:col-span-4 lg:col-span-2">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
              <SelectValue placeholder="الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفئات</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="col-span-6 sm:col-span-4 lg:col-span-2">
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="critical">🔴 حرج</SelectItem>
              <SelectItem value="low">🟡 منخفض</SelectItem>
              <SelectItem value="normal">🟢 طبيعي</SelectItem>
              <SelectItem value="good">🔵 جيد</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Filter */}
        <div className="col-span-6 sm:col-span-4 lg:col-span-2">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">🔤 اسم</SelectItem>
              <SelectItem value="stock">📦 مخزون</SelectItem>
              <SelectItem value="value">💰 قيمة</SelectItem>
              <SelectItem value="category">📁 فئة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="col-span-6 sm:col-span-4 lg:col-span-1">
          <Button
            variant="outline"
            onClick={onReset}
            className="h-9 w-full border-gray-300 hover:bg-gray-50 hover:text-gray-700 bg-white rounded-md transition-all duration-200 group px-2"
          >
            اعادة تعيين
            <RotateCcw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          إجمالي{" "}
          <span className="font-semibold text-gray-800">{data.length}</span>{" "}
          منتج •
          <span className="font-semibold text-blue-600 mr-1">
            {
              data.filter((item) => {
                const matchesCategory =
                  selectedCategory === "all" ||
                  item.category === selectedCategory;
                const matchesStatus =
                  selectedStatus === "all" ||
                  item.stockStatus === selectedStatus;
                const matchesSearch =
                  !searchQuery.trim() ||
                  item.name.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesStatus && matchesSearch;
              }).length
            }
          </span>
          نتيجة
        </div>
      </div>
    </div>
  );
}
