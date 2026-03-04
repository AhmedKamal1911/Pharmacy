import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierTransaction } from "../../types/transactions";

const getTransactionTypeLabel = (type: string) => {
  const labels = {
    PURCHASE: "شراء",
    PAYMENT: "دفع",
    RETURN: "مرتجع",
    ADJUSTMENT: "تعديل",
    SETTLEMENT: "تسوية",
  };
  return labels[type as keyof typeof labels] || type;
};

const getTransactionTypeColor = (type: string) => {
  const colors = {
    PURCHASE: "bg-red-100 text-red-800",
    PAYMENT: "bg-green-100 text-green-800",
    RETURN: "bg-orange-100 text-orange-800",
    ADJUSTMENT: "bg-blue-100 text-blue-800",
    SETTLEMENT: "bg-purple-100 text-purple-800",
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getStatusLabel = (status: string) => {
  const labels = {
    COMPLETED: "مكتمل",
    PENDING: "قيد الانتظار",
    CANCELLED: "ملغي",
  };
  return labels[status as keyof typeof labels] || status;
};

const getStatusColor = (status: string) => {
  const colors = {
    COMPLETED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const supplierTransactionsColumns: ColumnDef<SupplierTransaction>[] = [
  {
    accessorKey: "transactionDate",
    header: "التاريخ",
    cell: ({ row }) => {
      const date = new Date(row.getValue("transactionDate"));
      return (
        <div className="font-medium">
          {format(date, "dd MMM yyyy", { locale: ar })}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "الوصف",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "النوع",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge className={getTransactionTypeColor(type)}>
          {getTransactionTypeLabel(type)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <div
          className={`font-bold text-lg ${
            amount > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {amount > 0 ? "+" : ""}
          {formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "balanceAfter",
    header: "الرصيد بعد",
    cell: ({ row }) => {
      const balance = row.getValue("balanceAfter") as number;
      return (
        <div className="text-sm text-muted-foreground">
          {formatCurrency(balance)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "إجراءات",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex items-center gap-2">
          {transaction.referenceId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Handle view transaction
                if (transaction.type === "PURCHASE" && transaction.referenceId) {
                  window.location.href = `/purchases/${transaction.referenceId}`;
                }
              }}
              className="flex items-center gap-1"
            >
              <Eye size={16} />
              عرض
            </Button>
          )}
        </div>
      );
    },
  },
];
