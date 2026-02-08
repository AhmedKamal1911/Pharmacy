import type { ColumnDef } from "@tanstack/react-table";
import type { Supplier, SupplierDebitStatus } from "../../types";
import { Badge } from "@/components/ui/badge";
import { SupplierActions } from "./supplier-actions";

export const createSupplierColumns = (
  onSupplierUpdated?: (supplier: Supplier) => void,
  onSupplierDeleted?: (supplierId: string) => void,
): ColumnDef<Supplier>[] => [
  {
    accessorKey: "short",
    header: () => <div className="text-start">الاختصار</div>,
    cell: ({ row }) => (
      <div className="font-semibold text-start bg-muted px-2 py-1 rounded w-12.5">
        {row.getValue("short")}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const short = row.getValue<string>(columnId);
      const name = row.getValue<string>("name");
      const searchTerm = filterValue.toLowerCase();

      return (
        short.toLowerCase().includes(searchTerm) ||
        name.toLowerCase().includes(searchTerm)
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="text-start">اسم المورد</div>,
    cell: ({ row }) => (
      <div className="font-medium text-start">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "debit",
    header: () => <div className="text-start">المديونية</div>,
    cell: ({ row }) => {
      const value = row.getValue<number>("debit");
      return (
        <div className="font-medium text-red-600 text-start">
          {value.toLocaleString()} جنيه
        </div>
      );
    },
  },
  {
    accessorKey: "debitStatus",
    header: () => <div className="text-start">حالة المديونية</div>,
    cell: ({ row }) => {
      const status = row.getValue<SupplierDebitStatus>("debitStatus");
      const statusMap: Record<
        SupplierDebitStatus,
        {
          text: string;
          variant: "default" | "secondary" | "destructive" | "outline";
        }
      > = {
        PAID: { text: "مدفوع", variant: "default" },
        DUE: { text: "مستحق", variant: "secondary" },
        OVERDUE: { text: "متأخر", variant: "destructive" },
      };

      if (!status)
        return (
          <Badge variant="outline" className="text-start">
            -
          </Badge>
        );

      const { text, variant } = statusMap[status];
      return (
        <Badge variant={variant} className="text-start">
          {text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentPeriodMonths",
    header: () => <div className="text-start">فترة الأجل</div>,
    cell: ({ row }) => (
      <div className="text-start">
        {row.getValue<number>("paymentPeriodMonths")} شهر
      </div>
    ),
  },
  {
    accessorKey: "landlinePhone",
    header: () => <div className="text-start">التليفون الأرضي</div>,
    cell: ({ row }) => (
      <div className="text-start">{row.getValue("landlinePhone") ?? "-"}</div>
    ),
  },
  {
    accessorKey: "mobilePhone",
    header: () => <div className="text-start">التليفون المحمول</div>,
    cell: ({ row }) => (
      <div className="text-start">{row.getValue("mobilePhone") ?? "-"}</div>
    ),
  },
  {
    accessorKey: "settlementDate",
    header: () => <div className="text-start">تاريخ التقفيل</div>,
    cell: ({ row }) => {
      const date = row.getValue<string>("settlementDate");
      return (
        <div className="text-start">
          {date ? new Date(date).toLocaleDateString("en-US") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "checksDueDate",
    header: () => <div className="text-start">تاريخ سداد الشيكات</div>,
    cell: ({ row }) => {
      const date = row.getValue<string>("checksDueDate");
      return (
        <div className="text-start">
          {date ? new Date(date).toLocaleDateString("en-US") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "supplierType",
    header: () => <div className="text-start">نوع المورد</div>,
    cell: ({ row }) => {
      const type = row.getValue<string>("supplierType");
      const map: Record<string, string> = {
        WAREHOUSE: "مخزن",
        COMPANY: "شركة",
        PERSON: "فرد",
      };
      return <div className="text-start">{map[type] ?? type}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-start">إجراءات</div>,
    cell: ({ row }) => {
      const supplier = row.original;
      return (
        <div className="text-start">
          <SupplierActions
            supplier={supplier}
            onSupplierUpdated={onSupplierUpdated}
            onSupplierDeleted={onSupplierDeleted}
          />
        </div>
      );
    },
  },
];
