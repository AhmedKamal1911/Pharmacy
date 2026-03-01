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
import { stockColumns } from "./stock-columns";
import { StockFilters } from "../ui/stock-filters";
import type { StockItem } from "../../types";

interface StockTableProps {
  data: StockItem[];
  selectedCategory: string;
  selectedStatus: string;
  sortBy: string;
  searchQuery: string;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  allData: StockItem[];
}

export function StockTable({
  data,
  selectedCategory,
  selectedStatus,
  sortBy,
  searchQuery,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onSearchChange,
  onReset,
  allData,
}: StockTableProps) {
  const table = useReactTable({
    data,
    columns: stockColumns,
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
        <StockFilters
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          sortBy={sortBy}
          searchQuery={searchQuery}
          onCategoryChange={onCategoryChange}
          onStatusChange={onStatusChange}
          onSortChange={onSortChange}
          onSearchChange={onSearchChange}
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
                    colSpan={stockColumns.length}
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
