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
    OVERDUE: {
      label: "متأخر",
      variant: "destructive" as const,
    },
    CANCELLED: {
      label: "ملغي",
      variant: "secondary" as const,
    },
    RETURNED: {
      label: "مرتجع كامل",
      variant: "outline" as const,
    },
    PARTIALLY_RETURNED: {
      label: "مرتجع جزئي",
      variant: "outline" as const,
    },
  };

  const { label, variant } = statusConfig[status];

  return (
    <Badge variant={variant} className="text-start">
      {label}
    </Badge>
  );
}
