import type { ColumnDef } from "@tanstack/react-table";
import type { Medicine, MedicineVariant } from "../../types";
import { MedicineActions } from "./medicine-actions";

export const createColumns = (
  onView?: (medicine: Medicine) => void,
  onEdit?: (medicine: Medicine) => void,
  onDelete?: (medicine: Medicine) => void,
): ColumnDef<Medicine>[] => [
  {
    accessorKey: "code",
    header: () => <div className="text-start">الكود</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("code") || "-"}</div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-start">اسم الدواء</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<string>(columnId);
      if (!filterValue) return true;
      return value.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "category",
    header: () => <div className="text-start">الفئة</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("category")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      return row.getValue<string>(columnId) === filterValue;
    },
  },
  {
    accessorKey: "unit",
    header: () => <div className="text-start">الوحدة</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("unit") || "-"}</div>
    ),
  },
  {
    accessorKey: "totalStock",
    header: () => <div className="text-start">إجمالي المخزون</div>,
    cell: ({ row }) => {
      const variants = row.original.variants;
      const totalStock = variants.reduce(
        (sum, variant) => sum + variant.stock,
        0,
      );
      const minStock = row.original.minStock || 0;
      const isLowStock = totalStock <= minStock;

      return (
        <div
          className={`font-medium ${isLowStock ? "text-red-600" : "text-green-600"}`}
        >
          {totalStock}
          {isLowStock && (
            <span className="text-xs block text-red-500">
              (منخفض: الحد الأدنى {minStock})
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "variants",
    header: () => <div className="text-start">عدد المتغيرات</div>,
    cell: ({ row }) => {
      const variants = row.getValue("variants") as MedicineVariant[];
      return <div className="font-medium">{variants.length}</div>;
    },
  },
  {
    accessorKey: "minStock",
    header: () => <div className="text-start">الحد الأدنى</div>,
    cell: ({ row }) => {
      const minStock = row.getValue<number>("minStock") || 0;
      return <div className="font-medium">{minStock}</div>;
    },
  },
  {
    accessorKey: "basePrice",
    header: () => <div className="text-start">السعر الأساسي</div>,
    cell: ({ row }) => {
      const basePrice = row.getValue<number>("basePrice") || 0;
      return (
        <div className="font-medium text-blue-600">{basePrice.toFixed(2)}</div>
      );
    },
  },
  {
    accessorKey: "cost",
    header: () => <div className="text-start">التكلفة</div>,
    cell: ({ row }) => {
      const cost = row.getValue<number>("cost") || 0;
      return (
        <div className="font-medium text-green-600">{cost.toFixed(2)}</div>
      );
    },
  },
  {
    accessorKey: "activeBatch",
    header: () => <div className="text-start">الباتش النشط</div>,
    cell: ({ row }) => {
      const variants = row.original.variants;
      const basePrice = row.original.basePrice;

      // Debug logs
      console.log("Row data:", {
        name: row.original.name,
        basePrice,
        variants,
        firstVariant: variants[0],
      });

      // Find the variant that matches the base price (active batch)
      const activeBatch = variants.find(
        (variant) => variant.price === basePrice,
      );

      console.log("Active batch found:", activeBatch);

      if (!activeBatch) {
        return <div className="font-medium text-gray-500">-</div>;
      }

      return (
        <div className="font-medium">
          <div className="text-sm">{activeBatch.batchNumber || "N/A"}</div>
          <div className="text-xs text-gray-500">
            السعر: {activeBatch.price.toFixed(2)}
          </div>
          <div className="text-xs text-green-600">
            التكلفة: {(activeBatch?.cost || 0).toFixed(2)}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-start">الإجراءات</div>,
    cell: ({ row }) => {
      const medicine = row.original;
      return (
        <div className="text-start">
          <MedicineActions
            medicine={medicine}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      );
    },
  },
];
