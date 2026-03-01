import type { ColumnDef } from "@tanstack/react-table";
import type { ReturnInvoice, ReturnType, PaymentMethod, ReturnStatus } from "../../types";
import { ReturnTypeBadge, ReturnStatusBadge, PaymentMethodBadge } from "../ui/return-badge";
import { ReturnActions } from "./return-actions";

export const createColumns = (
  onView?: (returnInvoice: ReturnInvoice) => void,
): ColumnDef<ReturnInvoice>[] => [
  {
    accessorKey: "invoiceNumber",
    header: () => <div className="text-start">رقم المرتجع</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("invoiceNumber")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: () => <div className="text-start">التاريخ والوقت</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString("ar-EG")}</div>
          <div className="text-muted-foreground">{date.toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "originalInvoiceNumber",
    header: () => <div className="text-start">رقم الفاتورة الأصلية</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("originalInvoiceNumber")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div className="text-start">نوع المرتجع</div>,
    cell: ({ row }) => {
      const type = row.getValue<ReturnType>("type");
      return <ReturnTypeBadge type={type} />;
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue<string>(id) === value;
    },
  },
  {
    accessorKey: "entityName",
    header: () => <div className="text-start">العميل / المورد</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("entityName")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<string>(columnId);
      if (!filterValue) return true;
      return value.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-start">إجمالي المرتجع</div>,
    cell: ({ row }) => {
      const amount = row.getValue<number>("totalAmount");
      return (
        <div className="font-medium">
          {amount.toLocaleString("ar-EG")} ج.م
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: () => <div className="text-start">طريقة الاسترداد</div>,
    cell: ({ row }) => {
      const method = row.getValue<PaymentMethod>("paymentMethod");
      return <PaymentMethodBadge method={method} />;
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue<string>(id) === value;
    },
  },
  {
    accessorKey: "createdBy",
    header: () => <div className="text-start">الصيدلي / الكاشير</div>,
    cell: ({ row }) => (
      <div>{row.getValue("createdBy")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<string>(columnId);
      if (!filterValue) return true;
      return value.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "reason",
    header: () => <div className="text-start">سبب المرتجع</div>,
    cell: ({ row }) => {
      const reason = row.getValue<string>("reason");
      return (
        <div className="max-w-32 truncate" title={reason}>
          {reason || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-start">الحالة</div>,
    cell: ({ row }) => {
      const status = row.getValue<ReturnStatus>("status");
      return <ReturnStatusBadge status={status} />;
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue<string>(id) === value;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-start">الإجراءات</div>,
    cell: ({ row }) => {
      const returnInvoice = row.original;
      return (
        <div className="text-start">
          <ReturnActions
            returnInvoice={returnInvoice}
            onView={onView}
          />
        </div>
      );
    },
  },
];
