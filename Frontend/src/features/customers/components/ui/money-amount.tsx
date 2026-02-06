import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface MoneyAmountProps {
  amount: number;
  className?: string;
  showIcon?: boolean;
  showCurrency?: boolean;
  size?: "sm" | "base" | "lg";
}

export function MoneyAmount({
  amount,
  className,
  showIcon = true,
  showCurrency = true,
  size = "base",
}: MoneyAmountProps) {
  const isPositive = amount > 0;
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  const getIcon = () => {
    if (!showIcon) return null;

    if (isNegative) return <TrendingDown className="h-3 w-3" />;
    if (isPositive) return <TrendingUp className="h-3 w-3" />;
    return <Wallet className="h-3 w-3" />;
  };

  const getColorClass = () => {
    if (isNegative) return "text-orange-700";
    if (isPositive) return "text-emerald-700";
    return "text-gray-700";
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 font-medium",
        getColorClass(),
        getSizeClass(),
        className,
      )}
    >
      {getIcon()}
      <span>{absoluteAmount}</span>
      {showCurrency && <span>ر.س</span>}
    </div>
  );
}
