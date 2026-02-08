import { cn } from "@/lib/utils";
import {
  type Table as TableType,
} from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
