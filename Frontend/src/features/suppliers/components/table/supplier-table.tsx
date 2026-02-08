import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DataTablePagination,
  TableStatusControls,
} from "@/components/shared/table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  meta?: {
    onDataChange?: (data: TData[]) => void;
  };
}

export function SupplierTable<TData, TValue>({
  columns,
  data,
  isLoading,
  meta,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    meta,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {/* ===== Filters ===== */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <Input
          placeholder="بحث بالاختصار أو اسم المورد..."
          value={(table.getColumn("short")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("short")?.setFilterValue(e.target.value)
          }
          className="w-64"
        />

        {/* Supplier type */}
        <Select
          value={
            (table.getColumn("supplierType")?.getFilterValue() as string) ?? ""
          }
          onValueChange={(value) =>
            table
              .getColumn("supplierType")
              ?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="نوع المورد" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={2}
            avoidCollisions={false}
          >
            <SelectItem value="all">كل الأنواع</SelectItem>
            <SelectItem value="PERSON">فرد</SelectItem>
            <SelectItem value="COMPANY">شركة</SelectItem>
            <SelectItem value="WAREHOUSE">مخزن</SelectItem>
          </SelectContent>
        </Select>

        {/* Debit status */}
        <Select
          value={
            (table.getColumn("debitStatus")?.getFilterValue() as string) ?? ""
          }
          onValueChange={(value) =>
            table
              .getColumn("debitStatus")
              ?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="حالة المديونية" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={2}
            avoidCollisions={false}
          >
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="PAID">مدفوع</SelectItem>
            <SelectItem value="DUE">مستحق</SelectItem>
            <SelectItem value="OVERDUE">متأخر</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ===== Table ===== */}
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

      {/* ===== Pagination ===== */}
      <TableStatusControls table={table} />

      {/* ===== Pagination Component ===== */}
      <div className="flex items-center justify-center">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
