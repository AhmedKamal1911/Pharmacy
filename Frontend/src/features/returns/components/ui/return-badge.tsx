import { Badge } from "@/components/ui/badge";
import {
  ArrowDownLeft,
  PackageOpen,
  CheckCircle2,
  Clock,
  XCircle,
  Banknote,
  CreditCard,
  FileText,
} from "lucide-react";
import type { ReturnType, PaymentMethod, ReturnStatus } from "../../types";

interface ReturnTypeBadgeProps {
  type: ReturnType;
}

export function ReturnTypeBadge({ type }: ReturnTypeBadgeProps) {
  const isSales = type === "sales_return";
  return (
    <Badge
      variant="outline"
      className={`font-medium px-2.5 py-1 gap-1.5 border-0 ${
        isSales ? "bg-blue-50 text-blue-700" : "bg-indigo-50 text-indigo-700"
      }`}
    >
      {isSales ? <ArrowDownLeft size={14} /> : <PackageOpen size={14} />}
      {isSales ? "مرتجع مبيعات" : "مرتجع مشتريات"}
    </Badge>
  );
}

interface ReturnStatusBadgeProps {
  status: ReturnStatus;
}

export function ReturnStatusBadge({ status }: ReturnStatusBadgeProps) {
  const config = {
    completed: {
      label: "مكتملة",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700",
    },
    pending: {
      label: "معلقة",
      icon: Clock,
      className: "bg-amber-50 text-amber-700",
    },
    cancelled: {
      label: "ملغية",
      icon: XCircle,
      className: "bg-red-50 text-red-700",
    },
  };
  const { label, icon: Icon, className } = config[status];

  return (
    <Badge
      variant="outline"
      className={`font-medium px-2.5 py-1 gap-1.5 border-0 ${className}`}
    >
      <Icon size={14} />
      {label}
    </Badge>
  );
}

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  const config = {
    cash: {
      label: "نقدي",
      icon: Banknote,
      className: "bg-green-50 text-green-700",
    },
    visa: {
      label: "فيزا",
      icon: CreditCard,
      className: "bg-blue-50 text-blue-700",
    },
    credit: {
      label: "آجل",
      icon: FileText,
      className: "bg-slate-100 text-slate-700",
    },
  };
  const { label, icon: Icon, className } = config[method];

  return (
    <Badge
      variant="outline"
      className={`font-medium px-2.5 py-1 gap-1.5 border-0 ${className}`}
    >
      <Icon size={14} />
      {label}
    </Badge>
  );
}
