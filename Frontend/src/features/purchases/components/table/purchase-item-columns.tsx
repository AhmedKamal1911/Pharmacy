import type { ColumnDef } from "@tanstack/react-table";
import type { PurchaseItem } from "../../types";
import { Badge } from "@/components/ui/badge";
import { Package, Percent, Clock } from "lucide-react";

export function createPurchaseItemColumns(): ColumnDef<PurchaseItem>[] {
  return [
    {
      accessorKey: "medicineCode",
      header: () => <div className="text-right">كود الدواء</div>,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {row.getValue("medicineCode")}
        </Badge>
      ),
    },
    {
      accessorKey: "medicineName",
      header: () => <div className="text-right">اسم الصنف</div>,
      cell: ({ row }) => (
        <div className="font-medium text-slate-900">
          {row.getValue("medicineName")}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right">الكمية</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Package className="h-3 w-3 text-slate-400" />
          <span className="font-medium">{row.getValue("quantity")}</span>
        </div>
      ),
    },
    {
      accessorKey: "salePrice",
      header: () => <div className="text-right">سعر البيع</div>,
      cell: ({ row }) => {
        const price = row.getValue<number>("salePrice");
        return (
          <span className="font-medium text-green-600">
            {price.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "tax",
      header: () => <div className="text-right">الضريبة</div>,
      cell: ({ row }) => {
        const tax = row.getValue<number>("tax");
        return (
          <div className="flex items-center gap-1 justify-end">
            <Percent className="h-3 w-3 text-orange-400" />
            <span className="text-orange-600">{tax}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "mainDiscount",
      header: () => <div className="text-right">الخصم</div>,
      cell: ({ row }) => {
        const mainDiscount = row.getValue<number>("mainDiscount");
        const extraDiscount = row.original.extraDiscount;
        return (
          <div className="flex items-center gap-1 justify-end">
            <span className="text-red-600">{mainDiscount}</span>
            {extraDiscount && (
              <span className="text-red-500">+{extraDiscount}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "cost",
      header: () => <div className="text-right">التكلفة</div>,
      cell: ({ row }) => {
        const cost = row.getValue<number>("cost");
        return (
          <span className="font-medium text-slate-700">
            {cost.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "expiryDate",
      header: () => <div className="text-right">تاريخ الصلاحية</div>,
      cell: ({ row }) => {
        const expiryDate = row.getValue<string>("expiryDate");
        const expirable = row.original.expirable;
        return (
          <div className="flex items-center gap-2 justify-end">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" />
              <span className="text-slate-600">
                {expiryDate
                  ? new Date(expiryDate).toLocaleDateString("en-US")
                  : "-"}
              </span>
            </div>
            {expirable && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 text-xs"
              >
                صلاحية
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "bonus",
      header: () => <div className="text-right">بونص</div>,
      cell: ({ row }) => {
        const bonus = row.getValue<number>("bonus");
        return bonus ? (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            +{bonus}
          </Badge>
        ) : (
          <span className="text-slate-400">-</span>
        );
      },
    },
  ];
}
