import type { ColumnDef } from "@tanstack/react-table";
import type { PurchaseItem } from "../../types";
import { Badge } from "@/components/ui/badge";
import { Package, Percent, Clock } from "lucide-react";

export function createPurchaseItemColumns(): ColumnDef<PurchaseItem>[] {
  return [
    {
      accessorKey: "medicineCode",
      header: () => <div className="text-right px-2 ">كود الدواء</div>,
      cell: ({ row }) => (
        // الـ flex هنا مع w-full و justify-end هيجبره يروح يمين
        <div className="flex  px-2">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {row.getValue("medicineCode")}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "medicineName",
      header: () => <div className="text-right px-2">اسم الصنف</div>,
      cell: ({ row }) => (
        <div className="font-medium text-slate-900 text-right px-2">
          {row.getValue("medicineName")}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right px-2">الكمية</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-start px-2">
          <span className="font-medium">{row.getValue("quantity")}</span>
          <Package className="h-4 w-4 text-slate-400" />
        </div>
      ),
    },
    {
      accessorKey: "salePrice",
      header: () => <div className="text-right px-2">سعر البيع</div>,
      cell: ({ row }) => (
        <div className="text-right w-full font-medium text-green-600 px-2">
          {row.getValue<number>("salePrice").toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "tax",
      header: () => <div className="text-right px-2">الضريبة</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-start  w-full px-2 text-orange-600">
          <span>{row.getValue<number>("tax")}%</span>
          <Percent className="h-3 w-3 text-orange-400" />
        </div>
      ),
    },
    {
      accessorKey: "mainDiscount",
      header: () => <div className="text-right px-2">الخصم</div>,
      cell: ({ row }) => {
        const mainDiscount = row.getValue<number>("mainDiscount");
        const extraDiscount = row.original.extraDiscount;
        return (
          <div className="flex justify-start">
            <Badge
              variant="outline"
              className="border-red-200 bg-red-50 text-red-700 font-medium px-3 py-1 rounded-full"
            >
              {extraDiscount && extraDiscount > 0
                ? `${mainDiscount}% + ${extraDiscount}%`
                : `${mainDiscount}%`}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "cost",
      header: () => <div className="text-right px-2">التكلفة</div>,
      cell: ({ row }) => (
        <div className="text-right w-full font-medium text-slate-700 px-2">
          {row.getValue<number>("cost").toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "expiryDate",
      header: () => <div className="text-right px-2">تاريخ الصلاحية</div>,
      cell: ({ row }) => {
        const expiryDate = row.getValue<string>("expiryDate");
        const expirable = row.original.expirable;
        return (
          <div className="flex items-center gap-2 justify-start w-full px-2">
            {expirable ? (
              <>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 text-xs"
                >
                  صلاحية
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-slate-600 text-sm">
                    {expiryDate
                      ? new Date(expiryDate).toLocaleDateString("en-GB")
                      : "-"}
                  </span>
                  <Clock className="h-3 w-3 text-slate-400" />
                </div>
              </>
            ) : (
              <Badge
                variant="outline"
                className="bg-gray-50 text-gray-600 border-gray-200 text-xs"
              >
                بدون
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "bonus",
      header: () => <div className="text-right px-2">بونص</div>,
      cell: ({ row }) => (
        <div className="text-right w-full px-2">
          {row.getValue<number>("bonus") ? (
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              +{row.getValue("bonus")}
            </Badge>
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </div>
      ),
    },
  ];
}
