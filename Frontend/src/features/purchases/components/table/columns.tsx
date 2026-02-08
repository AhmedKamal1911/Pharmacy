import type { ColumnDef } from "@tanstack/react-table";
import type { Purchase, PurchaseStatus } from "../../types";
import { PurchaseStatusBadge } from "../ui/purchase-status-badge";
import { PurchaseActions } from "./purchase-actions";

export function createPurchaseColumns(
  onView?: (purchase: Purchase) => void,
  onEdit?: (purchase: Purchase) => void,
  onDelete?: (purchase: Purchase) => void,
): ColumnDef<Purchase>[] {
  return [
    {
      accessorKey: "serialNumber",
      header: () => <div className="text-start">مسلسل</div>,
      cell: ({ row }) => (
        <div className="font-medium text-start">
          {row.getValue("serialNumber")}
        </div>
      ),
    },
    {
      accessorKey: "invoiceNumber",
      header: () => <div className="text-start">رقم الفاتورة</div>,
      cell: ({ row }) => (
        <div className="font-medium text-start">
          {row.getValue("invoiceNumber")}
        </div>
      ),
    },
    {
      accessorKey: "invoiceDate",
      header: () => <div className="text-start">تاريخ الفاتورة</div>,
      cell: ({ row }) => {
        const date = row.getValue<string>("invoiceDate");
        return (
          <div className="text-start">
            {date ? new Date(date).toLocaleDateString("en-US") : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "supplierName",
      header: () => <div className="text-start">المورد</div>,
      cell: ({ row }) => (
        <div className="font-medium text-start">
          {row.getValue("supplierName")}
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const supplierName = row.getValue<string>(columnId);
        return supplierName.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "total",
      header: () => <div className="text-start">المجموع الكلي</div>,
      cell: ({ row }) => {
        const total = row.getValue<number>("total");
        return (
          <div className="font-medium text-start">
            {total.toLocaleString()} جنيه
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-start">الحالة</div>,
      cell: ({ row }) => {
        const status = row.getValue<PurchaseStatus>("status");
        return <PurchaseStatusBadge status={status} />;
      },
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true;
        return row.getValue<string>(id) === value;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-start">إجراءات</div>,
      cell: ({ row }) => {
        const purchase = row.original;
        return (
          <div className="text-start">
            <PurchaseActions
              purchase={purchase}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        );
      },
    },
  ];
}
