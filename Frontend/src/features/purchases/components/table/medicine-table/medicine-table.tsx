import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PurchaseItem } from "@/features/purchases/types";
import type { MedicineTableMeta } from "./medicine-columns";
import { medicineColumns } from "./medicine-columns";

interface DataTableProps {
  data: PurchaseItem[];
  onUpdateItem: (
    id: string,
    field: keyof PurchaseItem,
    value: PurchaseItem[keyof PurchaseItem],
  ) => void;
  onRemoveItem: (id: string) => void;
}

export function MedicineTable({
  data,
  onUpdateItem,
  onRemoveItem,
}: DataTableProps) {
  const table = useReactTable({
    data,
    columns: medicineColumns,
    getCoreRowModel: getCoreRowModel(),
    // بنمرر الدوال هنا عشان الأعمدة تقدر تستخدمها
    meta: {
      updateData: onUpdateItem,
      removeRow: onRemoveItem,
    } as MedicineTableMeta,
  });

  return (
    <div className="rounded-md border bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap text-start"
                  >
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2 align-middle">
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
                  colSpan={medicineColumns.length}
                  className="h-24 text-center text-slate-500"
                >
                  لا توجد أصناف مضافة. قم بإضافة صنف جديد لبدء الفاتورة.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
