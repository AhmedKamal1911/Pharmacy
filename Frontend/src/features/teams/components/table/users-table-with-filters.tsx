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
import { Search, Filter, Users } from "lucide-react";
import type { User, UserStatus } from "../../types";

interface UsersTableWithFiltersProps {
  data: User[];
  searchQuery: string;
  statusFilter: UserStatus | "all";
  roleFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: UserStatus | "all") => void;
  onRoleChange: (value: string) => void;
  allData: User[];
  isLoading?: boolean;
  columns: ColumnDef<User>[];
  onCreateUser: () => void;
}

export function UsersTableWithFilters({
  data,
  searchQuery,
  statusFilter,
  roleFilter,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  allData,
  isLoading,
  columns,
  onCreateUser,
}: UsersTableWithFiltersProps) {
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
              <span className="text-sm text-slate-500">
                جاري تحميل البيانات...
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <div className="p-6 space-y-4">
        {/* Filters Section - matching returns filters exactly */}
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md">
                <Filter className="h-3.5 w-3.5" />
                <span className="font-medium text-sm">البحث والتصفية</span>
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {allData.length} مستخدم
              </div>
            </div>

            {/* Add User Button */}
            <Button
              onClick={onCreateUser}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md transition-all duration-200"
            >
              <Users className="ml-2 h-4 w-4" />
              إضافة مستخدم جديد
            </Button>

            {/* Active Filters Indicator */}
            {(statusFilter !== "all" ||
              roleFilter !== "all" ||
              searchQuery) && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">فلاتر نشطة:</span>
                <div className="flex gap-0.5">
                  {statusFilter !== "all" && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      حالة
                    </span>
                  )}
                  {roleFilter !== "all" && (
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      دور
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
                  placeholder="ابحث عن المستخدم..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pr-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="col-span-6 sm:col-span-4 lg:col-span-2">
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  <SelectItem value="active">✅ نشط</SelectItem>
                  <SelectItem value="inactive">❌ غير نشط</SelectItem>
                  <SelectItem value="deleted">🗑️ محذوف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Filter */}
            <div className="col-span-6 sm:col-span-4 lg:col-span-2">
              <Select value={roleFilter} onValueChange={onRoleChange}>
                <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
                  <SelectValue placeholder="الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الأدوار</SelectItem>
                  <SelectItem value="admin">👤 مدير</SelectItem>
                  <SelectItem value="pharmacist">💊 صيدلي</SelectItem>
                  <SelectItem value="cashier">💰 كاشير</SelectItem>
                  <SelectItem value="viewer">👁️ مشاهدة فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              إجمالي{" "}
              <span className="font-semibold text-gray-800">
                {allData.length}
              </span>{" "}
              مستخدم •
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
