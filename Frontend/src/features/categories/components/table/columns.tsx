import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ActionsCell } from "./actions-cell";

import type { Category } from "../../types";

export const createColumns = (): ColumnDef<Category>[] => [
  {
    accessorKey: "categoryId",
    header: () => <div className="text-start">كود الفئة</div>,
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        {row.getValue("categoryId")}
      </Badge>
    ),
  },
  {
    accessorKey: "categoryName",
    header: () => <div className="text-start">اسم الفئة</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("categoryName")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<string>(columnId);
      if (!filterValue) return true;
      return value.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-start">الوصف</div>,
    cell: ({ row }) => {
      const description = row.getValue<string>("description");
      return (
        <div className="max-w-32 truncate" title={description}>
          {description || "-"}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<string>(columnId);
      if (!filterValue) return true;
      return value.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "totalItems",
    header: () => <div className="text-start">عدد الأصناف</div>,
    cell: ({ row }) => {
      const totalItems = row.getValue<number>("totalItems");
      return (
        <Badge
          variant={totalItems > 0 ? "default" : "secondary"}
          className="font-semibold"
        >
          {totalItems}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-start">الحالة</div>,
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>("isActive");
      const category = row.original;
      console.log(
        `Category ${category.categoryId}: isActive = ${isActive}, totalItems = ${category.totalItems}`,
      );

      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={
            isActive
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }
        >
          {isActive ? "✅ نشطة" : "⏸️ غير نشطة"}
        </Badge>
      );
    },
    filterFn: (row, _id, value) => {
      if (!value || value === "all") return true;
      const isActive = row.getValue<boolean>("isActive");
      if (value === "active") return isActive;
      if (value === "inactive") return !isActive;
      return true;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-start">الإجراءات</div>,
    enableHiding: false,
    cell: ({ row }) => <ActionsCell category={row.original} />,
  },
];
