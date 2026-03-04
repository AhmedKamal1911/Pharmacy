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
import { format } from "date-fns";
import type { SupplierTransaction } from "../../types/transactions";

interface SupplierTransactionsFiltersProps {
  selectedType: string;
  selectedStatus: string;
  sortBy: string;
  searchQuery: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  onReset: () => void;
  data: SupplierTransaction[];
}

export function SupplierTransactionsFilters({
  selectedType,
  selectedStatus,
  sortBy,
  searchQuery,
  dateFrom,
  dateTo,
  onTypeChange,
  onStatusChange,
  onSortChange,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onReset,
  data,
}: SupplierTransactionsFiltersProps) {
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
            {data.length} معاملة
          </div>
        </div>

        {/* Active Filters Indicator */}
        {(selectedType !== "all" ||
          selectedStatus !== "all" ||
          searchQuery ||
          dateFrom ||
          dateTo) && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">فلاتر نشطة:</span>
            <div className="flex gap-0.5">
              {selectedType !== "all" && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  نوع
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
              {(dateFrom || dateTo) && (
                <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                  تاريخ
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters Row */}
      <div className="flex gap-2 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="ابحث في المعاملات..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="w-[140px]">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
              <SelectValue placeholder="النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              <SelectItem value="PURCHASE">شراء</SelectItem>
              <SelectItem value="PAYMENT">دفع</SelectItem>
              <SelectItem value="RETURN">مرتجع</SelectItem>
              <SelectItem value="ADJUSTMENT">تعديل</SelectItem>
              <SelectItem value="SETTLEMENT">تسوية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-[140px]">
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="COMPLETED">مكتمل</SelectItem>
              <SelectItem value="PENDING">قيد الانتظار</SelectItem>
              <SelectItem value="CANCELLED">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date From Filter */}
        <div className="w-[140px]">
          <Input
            type="date"
            value={dateFrom ? format(dateFrom, "yyyy-MM-dd") : ""}
            onChange={(e) =>
              onDateFromChange(
                e.target.value ? new Date(e.target.value) : undefined,
              )
            }
            className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md"
            placeholder="من تاريخ"
          />
        </div>

        {/* Date To Filter */}
        <div className="w-[140px]">
          <Input
            type="date"
            value={dateTo ? format(dateTo, "yyyy-MM-dd") : ""}
            onChange={(e) =>
              onDateToChange(
                e.target.value ? new Date(e.target.value) : undefined,
              )
            }
            className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md"
            placeholder="إلى تاريخ"
          />
        </div>

        {/* Sort Filter */}
        <div className="w-[140px]">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">📅 التاريخ</SelectItem>
              <SelectItem value="amount">💰 المبلغ</SelectItem>
              <SelectItem value="type">📁 النوع</SelectItem>
              <SelectItem value="status">🏷️ الحالة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="w-[100px]">
          <Button
            variant="outline"
            onClick={onReset}
            className="h-9 w-full border-gray-300 hover:bg-gray-50 hover:text-gray-700 bg-white rounded-md transition-all duration-200 group px-2"
          >
            إعادة تعيين
            <RotateCcw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          إجمالي{" "}
          <span className="font-semibold text-gray-800">{data.length}</span>{" "}
          معاملة •
          <span className="font-semibold text-blue-600 mr-1">
            {
              data.filter((item) => {
                const matchesType =
                  selectedType === "all" || item.type === selectedType;
                const matchesStatus =
                  selectedStatus === "all" || item.status === selectedStatus;
                const matchesSearch =
                  !searchQuery.trim() ||
                  item.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                const matchesDateFrom =
                  !dateFrom || new Date(item.transactionDate) >= dateFrom;
                const matchesDateTo =
                  !dateTo || new Date(item.transactionDate) <= dateTo;
                return (
                  matchesType &&
                  matchesStatus &&
                  matchesSearch &&
                  matchesDateFrom &&
                  matchesDateTo
                );
              }).length
            }
          </span>
          نتيجة
        </div>
      </div>
    </div>
  );
}
