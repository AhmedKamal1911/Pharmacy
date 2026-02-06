import type { ColumnDef } from "@tanstack/react-table";
import type { Customer } from "../../types";
import { CustomerTypeBadge, CustomerBalanceBadge } from "../ui/customer-badge";
import { CustomerActions } from "./customer-actions";

interface CustomerTableActionsProps {
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const createColumns = ({
  onView,
  onEdit,
  onDelete,
}: CustomerTableActionsProps): ColumnDef<Customer>[] => [
  {
    accessorKey: "name",
    header: () => <div className="text-start">اسم العميل</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<string>(columnId);
      if (!filterValue) return true;

      return value.toLowerCase().startsWith(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "type",
    header: () => <div className="text-start">النوع</div>,

    cell: ({ row }) => {
      const type = row.getValue<string>("type");
      return <CustomerTypeBadge type={type as "فرد" | "شركة"} />;
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue<string>(id) === value;
    },
  },
  {
    id: "balanceStatus",
    header: () => <div className="text-start">الرصيد</div>,
    accessorFn: (row) => row.balance,
    cell: ({ getValue }) => {
      const amount = getValue<number>();
      return <CustomerBalanceBadge balance={amount} />;
    },
    filterFn: (row, id, value) => {
      const amount = row.getValue<number>(id);

      if (value === "debit") return amount > 0;
      if (value === "credit") return amount < 0;
      if (value === "cash") return amount === 0;
      return true;
    },
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-start">رقم الهاتف</div>,
  },
  {
    id: "loyaltyPoints",
    header: () => <div className="text-start">نقاط الولاء</div>,
    accessorFn: (row) => row.loyalty?.totalPoints ?? 0,
    cell: ({ getValue }) => <span>{getValue<number>()}</span>,
  },
  {
    id: "actions",
    header: () => <div className="text-start">الإجراءات</div>,
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <CustomerActions
          customer={customer}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];
