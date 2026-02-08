import { Badge } from "@/components/ui/badge";
import type { PurchaseStatus } from "../../types";

interface PurchaseStatusBadgeProps {
  status: PurchaseStatus;
}

export function PurchaseStatusBadge({ status }: PurchaseStatusBadgeProps) {
  const statusConfig = {
    PAID: {
      label: "مدفوع",
      variant: "default" as const,
    },
    PENDING: {
      label: "معلق",
      variant: "secondary" as const,
    },
    OVERDUE: {
      label: "متأخر",
      variant: "destructive" as const,
    },
  };

  const { label, variant } = statusConfig[status];

  return (
    <Badge variant={variant} className="text-start">
      {label}
    </Badge>
  );
}
