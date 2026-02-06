import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
  type Table as TableType,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export function CustomersTable<TData, TValue>({
  columns,
  data,
  isLoading,
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
          placeholder="بحث باسم العميل..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="w-64"
        />

        {/* Customer type */}
        <Select
          value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) =>
            table
              .getColumn("type")
              ?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="نوع العميل" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={2}
            avoidCollisions={false}
          >
            <SelectItem value="all">كل الأنواع</SelectItem>
            <SelectItem value="فرد">فرد</SelectItem>
            <SelectItem value="شركة">شركة</SelectItem>
          </SelectContent>
        </Select>

        {/* Balance status */}
        <Select
          value={
            (table.getColumn("balanceStatus")?.getFilterValue() as string) ?? ""
          }
          onValueChange={(value) =>
            table
              .getColumn("balanceStatus")
              ?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="حالة الرصيد" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={2}
            avoidCollisions={false}
          >
            <SelectItem value="all">كل الأرصدة</SelectItem>
            <SelectItem value="debit">مدين</SelectItem>
            <SelectItem value="credit">دائن</SelectItem>
            <SelectItem value="cash">نقدي</SelectItem>
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

interface DataTablePaginationProps<TData> {
  table: TableType<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  // Helper to generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showLeftEllipsis = currentPage > 3;
    const showRightEllipsis = currentPage < totalPages - 2;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (showLeftEllipsis) pages.push("start-ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (showRightEllipsis) pages.push("end-ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Pagination dir="rtl" className="mt-4">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              table.previousPage();
            }}
            aria-disabled={!table.getCanPreviousPage()}
            className={cn(
              "gap-1 pl-2.5",
              !table.getCanPreviousPage() && "pointer-events-none opacity-50",
            )}
          >
            السابق
          </PaginationPrevious>
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === "number" ? (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.setPageIndex(page - 1);
                }}
                isActive={currentPage === page}
              >
                {page}
                {/* Optional: use Arabic numerals */}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              table.nextPage();
            }}
            aria-disabled={!table.getCanNextPage()}
            className={cn(
              "gap-1 pr-2.5",
              !table.getCanNextPage() && "pointer-events-none opacity-50",
            )}
          >
            التالي
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function TableStatusControls<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;

  // Calculate range for "Showing X to Y"
  const startRange = pageIndex * pageSize + 1;
  const endRange = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div
      className="flex flex-col-reverse items-center justify-between gap-4 px-2 py-4 sm:flex-row"
      dir="rtl"
    >
      {/* Status Text: Showing X of Y */}
      <div className="text-sm text-muted-foreground tabular-nums">
        عرض <span className="font-medium text-foreground">{startRange}</span>{" "}
        إلى <span className="font-medium text-foreground">{endRange}</span> من{" "}
        <span className="font-medium text-foreground">{totalRows}</span> نتيجة
      </div>

      {/* Rows Per Page Selector */}
      <div className="flex items-center gap-3">
        <p className="whitespace-nowrap text-sm font-medium">عدد الصفوف:</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-9 w-[70px] bg-background">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top" align="end">
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem
                key={size}
                value={`${size}`}
                className="cursor-pointer"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
