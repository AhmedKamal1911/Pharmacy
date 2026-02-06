import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  User,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface CustomerBadgeProps {
  type?: "فرد" | "شركة";
  status?: "cash" | "credit" | "debit";
  variant?: "default" | "outline" | "secondary" | "destructive";
  className?: string;
  children?: React.ReactNode;
}

export function CustomerBadge({
  type,
  status,
  variant,
  className,
  children,
}: CustomerBadgeProps) {
  // Auto-determine variant based on type or status if not provided
  const getVariant = ():
    | "default"
    | "outline"
    | "secondary"
    | "destructive" => {
    if (variant) return variant;

    if (type === "شركة") return "outline";
    if (type === "فرد") return "secondary";

    if (status === "cash") return "secondary";
    if (status === "credit") return "default";
    if (status === "debit") return "destructive";

    return "secondary";
  };

  const getIcon = () => {
    if (type === "شركة") return <Building2 className="h-3 w-3" />;
    if (type === "فرد") return <User className="h-3 w-3" />;

    if (status === "cash") return <Wallet className="h-3 w-3" />;
    if (status === "credit") return <TrendingUp className="h-3 w-3" />;
    if (status === "debit") return <TrendingDown className="h-3 w-3" />;

    return null;
  };

  const getStyles = () => {
    const baseStyles =
      "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-all duration-200";

    if (type === "شركة") {
      return cn(
        baseStyles,
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        className,
      );
    }

    if (type === "فرد") {
      return cn(
        baseStyles,
        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        className,
      );
    }

    if (status === "cash") {
      return cn(
        baseStyles,
        "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
        className,
      );
    }

    if (status === "credit") {
      return cn(
        baseStyles,
        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        className,
      );
    }

    if (status === "debit") {
      return cn(
        baseStyles,
        "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200",
        className,
      );
    }

    return cn(baseStyles, className);
  };

  const icon = getIcon();
  const finalVariant = getVariant();
  const styles = getStyles();

  // If children are provided, use them as content
  if (children) {
    return (
      <Badge variant={finalVariant} className={styles}>
        {icon}
        {children}
      </Badge>
    );
  }

  // Auto-generate content based on type or status
  const getContent = () => {
    if (type === "شركة") return "شركة";
    if (type === "فرد") return "فرد";

    if (status === "cash") return "كاش";
    if (status === "credit") return "دائن";
    if (status === "debit") return "مدين";

    return children;
  };

  return (
    <Badge variant={finalVariant} className={styles}>
      {icon}
      {getContent()}
    </Badge>
  );
}

// Specific badge components for better reusability
export function CustomerTypeBadge({
  type,
  className,
}: {
  type: "فرد" | "شركة";
  className?: string;
}) {
  return <CustomerBadge type={type} className={className} />;
}

export function CustomerBalanceBadge({
  balance,
  className,
}: {
  balance: number;
  className?: string;
}) {
  const status = balance < 0 ? "debit" : balance > 0 ? "credit" : "cash";
  return (
    <CustomerBadge status={status} className={className}>
      {Math.abs(balance)} ر.س
    </CustomerBadge>
  );
}
