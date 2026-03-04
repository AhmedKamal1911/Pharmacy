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
} from "@tanstack/react-table";

import { SupplierTransactionsFilters } from "../ui/supplier-transactions-filters";
import type { SupplierTransaction } from "../../types/transactions";
import { supplierTransactionsColumns } from "./supplier-transactions-columns";

interface SupplierTransactionsTableProps {
  data: SupplierTransaction[];
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
  allData: SupplierTransaction[];
}

export function SupplierTransactionsTable({
  data,
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
  allData,
}: SupplierTransactionsTableProps) {
  const table = useReactTable({
    data,
    columns: supplierTransactionsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card className="border-0 shadow-none">
      <div className="p-6 space-y-4">
        {/* Filters Section */}
        <SupplierTransactionsFilters
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          sortBy={sortBy}
          searchQuery={searchQuery}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onTypeChange={onTypeChange}
          onStatusChange={onStatusChange}
          onSortChange={onSortChange}
          onSearchChange={onSearchChange}
          onDateFromChange={onDateFromChange}
          onDateToChange={onDateToChange}
          onReset={onReset}
          data={allData}
        />

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
                    colSpan={supplierTransactionsColumns.length}
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
