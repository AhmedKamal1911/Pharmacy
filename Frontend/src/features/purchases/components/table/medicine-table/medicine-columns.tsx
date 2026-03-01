import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { PurchaseItem } from "@/features/purchases/types";
import type { ColumnDef } from "@tanstack/react-table";

// دي الواجهة اللي هنستخدمها لتمرير دوال التعديل والحذف للجدول
export interface MedicineTableMeta {
  updateData: (
    id: string,
    field: keyof PurchaseItem,
    value: PurchaseItem[keyof PurchaseItem],
  ) => void;
  removeRow: (id: string) => void;
}

export const medicineColumns: ColumnDef<PurchaseItem>[] = [
  {
    accessorKey: "medicineName",
    header: () => <div className="text-start font-medium">اسم الصنف</div>,
    cell: ({ row }) => (
      <div className="font-medium min-w-[150px]">
        {row.original.medicineName}
        {row.original.medicineCode && (
          <span className="block text-xs text-slate-500">
            {row.original.medicineCode}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-start font-medium">الكمية</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as MedicineTableMeta;
      return (
        <Input
          type="number"
          min="1"
          className="w-16 h-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
          value={row.original.quantity}
          onChange={(e) =>
            meta.updateData(
              row.original.id,
              "quantity",
              Number(e.target.value) || 1,
            )
          }
        />
      );
    },
  },
  {
    accessorKey: "bonus",
    header: () => <div className="text-start font-medium">بونص</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as MedicineTableMeta;
      return (
        <Input
          type="number"
          min="0"
          className="w-16 h-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
          value={row.original.bonus}
          onChange={(e) =>
            meta.updateData(
              row.original.id,
              "bonus",
              Number(e.target.value) || 0,
            )
          }
        />
      );
    },
  },
  {
    accessorKey: "salePrice",
    header: () => <div className="text-start font-medium">سعر البيع</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as MedicineTableMeta;
      return (
        <Input
          type="number"
          min="0"
          step="0.01"
          className="w-20 h-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
          value={row.original.salePrice}
          onChange={(e) =>
            meta.updateData(
              row.original.id,
              "salePrice",
              Number(e.target.value) || 0,
            )
          }
        />
      );
    },
  },
  {
    accessorKey: "cost",
    header: () => <div className="text-start font-medium">التكلفة</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as MedicineTableMeta;
      return (
        <Input
          type="number"
          min="0"
          step="0.01"
          className="w-20 h-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
          value={row.original.cost}
          onChange={(e) =>
            meta.updateData(
              row.original.id,
              "cost",
              Number(e.target.value) || 0,
            )
          }
        />
      );
    },
  },
  {
    accessorKey: "mainDiscount",
    header: () => <div className="text-start font-medium">خصم %</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as MedicineTableMeta;
      return (
        <Input
          type="number"
          min="0"
          max="100"
          className="w-16 h-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
          value={row.original.mainDiscount}
          onChange={(e) =>
            meta.updateData(
              row.original.id,
              "mainDiscount",
              Number(e.target.value) || 0,
            )
          }
        />
      );
    },
  },
  {
    accessorKey: "tax",
    header: () => <div className="text-start font-medium">ضريبة %</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as MedicineTableMeta;
      return (
        <Input
          type="number"
          min="0"
          max="100"
          className="w-16 h-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
          value={row.original.tax}
          onChange={(e) =>
            meta.updateData(row.original.id, "tax", Number(e.target.value) || 0)
          }
        />
      );
    },
  },
  {
    accessorKey: "expiryDate",
    header: () => <div className="text-start font-medium">الصلاحية</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as MedicineTableMeta;
      return (
        <Input
          type="date"
          className="w-28 h-8 text-sm border-slate-200 focus:border-blue-500 focus:ring-blue-500"
          value={row.original.expiryDate || ""}
          disabled={!row.original.expirable}
          onChange={(e) =>
            meta.updateData(row.original.id, "expiryDate", e.target.value)
          }
        />
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-start font-medium">إجراءات</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as MedicineTableMeta;
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => meta.removeRow(row.original.id)}
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];
