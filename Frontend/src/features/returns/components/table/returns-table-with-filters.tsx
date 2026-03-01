import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DataTablePagination,
  TableStatusControls,
} from "@/components/shared/table-pagination";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw, Filter, Calendar } from "lucide-react";
import type { ReturnInvoice, ReturnType, ReturnStatus } from "../../types";

interface ReturnsTableWithFiltersProps {
  data: ReturnInvoice[];
  searchQuery: string;
  typeFilter: ReturnType | "all";
  statusFilter: ReturnStatus | "all";
  dateFilter: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: ReturnType | "all") => void;
  onStatusChange: (value: ReturnStatus | "all") => void;
  onDateChange: (value: string) => void;
  onReset: () => void;
  allData: ReturnInvoice[];
  isLoading?: boolean;
  columns: ColumnDef<ReturnInvoice>[];
}

export function ReturnsTableWithFilters({
  data,
  searchQuery,
  typeFilter,
  statusFilter,
  dateFilter,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onDateChange,
  onReset,
  allData,
  isLoading,
  columns,
}: ReturnsTableWithFiltersProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <Card className="border-0 shadow-none">
        <div className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse flex flex-col items-center gap-2">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-slate-500">جاري تحميل البيانات...</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <div className="p-6 space-y-4">
        {/* Filters Section - matching stock filters exactly */}
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md">
                <Filter className="h-3.5 w-3.5" />
                <span className="font-medium text-sm">البحث والتصفية</span>
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {allData.length} مرتجع
              </div>
            </div>

            {/* Active Filters Indicator */}
            {(typeFilter !== "all" ||
              statusFilter !== "all" ||
              dateFilter !== "all" ||
              searchQuery) && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">فلاتر نشطة:</span>
                <div className="flex gap-0.5">
                  {typeFilter !== "all" && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      نوع
                    </span>
                  )}
                  {statusFilter !== "all" && (
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      حالة
                    </span>
                  )}
                  {dateFilter !== "all" && (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      فترة
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
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
                  placeholder="ابحث عن المرتجع..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pr-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="col-span-6 sm:col-span-4 lg:col-span-2">
              <Select value={typeFilter} onValueChange={onTypeChange}>
                <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
                  <SelectValue placeholder="النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الأنواع</SelectItem>
                  <SelectItem value="sales_return">📤 مبيعات</SelectItem>
                  <SelectItem value="purchases_return">📥 مشتريات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="col-span-6 sm:col-span-4 lg:col-span-2">
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  <SelectItem value="completed">✅ مكتملة</SelectItem>
                  <SelectItem value="pending">⏳ معلقة</SelectItem>
                  <SelectItem value="cancelled">❌ ملغية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="col-span-6 sm:col-span-4 lg:col-span-2">
              <Select value={dateFilter} onValueChange={onDateChange}>
                <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
                  <Calendar className="ml-2 h-3.5 w-3.5" />
                  <SelectValue placeholder="الفترة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">📅 كل الوقت</SelectItem>
                  <SelectItem value="today">🌞 اليوم</SelectItem>
                  <SelectItem value="week">📆 آخر 7 أيام</SelectItem>
                  <SelectItem value="month">📅 آخر 30 يوم</SelectItem>
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
                إعادة تعيين
                <RotateCcw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-300" />
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              إجمالي{" "}
              <span className="font-semibold text-gray-800">{allData.length}</span>{" "}
              مرتجع •
              <span className="font-semibold text-blue-600 mr-1">
                {data.length}
              </span>
              نتيجة
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    لا توجد بيانات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="space-y-3">
          <TableStatusControls table={table} />
          <div className="flex items-center justify-center">
            <DataTablePagination table={table} />
          </div>
        </div>
      </div>
    </Card>
  );
}
