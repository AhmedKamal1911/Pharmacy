import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { StockItem } from "../../types";

export const stockColumns: ColumnDef<StockItem>[] = [
  {
    accessorKey: "stockStatus",
    header: () => <div className="text-center font-semibold">حالة المخزون</div>,
    cell: ({ row }) => {
      const status = row.getValue("stockStatus") as string;
      const statusConfig = {
        critical: {
          icon: AlertTriangle,
          variant: "destructive" as const,
          label: "حرج",
        },
        low: {
          icon: TrendingDown,
          variant: "secondary" as const,
          label: "منخفض",
        },
        normal: { icon: Package, variant: "outline" as const, label: "طبيعي" },
        good: { icon: TrendingUp, variant: "default" as const, label: "جيد" },
      };

      const config =
        statusConfig[status as keyof typeof statusConfig] ||
        statusConfig.normal;
      const Icon = config.icon;

      return (
        <div className="flex justify-center">
          <Badge
            variant={config.variant}
            className="flex items-center gap-1.5 w-fit px-3 py-1 shadow-sm"
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="font-medium">{config.label}</span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="text-start font-semibold">اسم الدواء</div>,
    cell: ({ row }) => (
      <div className="text-start">
        <div className="font-semibold text-gray-900">
          {row.getValue("name")}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          {row.original.category}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "currentStock",
    header: () => (
      <div className="text-center font-semibold">المخزون الحالي</div>
    ),
    cell: ({ row }) => {
      const stock = row.getValue("currentStock") as number;
      const safeStock =
        isNaN(stock) || stock === null || stock === undefined ? 0 : stock;
      const stockColor =
        safeStock < 20
          ? "text-red-600"
          : safeStock < 50
            ? "text-orange-600"
            : safeStock < 100
              ? "text-yellow-600"
              : "text-green-600";
      return (
        <div className="text-center">
          <div className={`font-bold text-lg ${stockColor}`}>{safeStock}</div>
          <div className="text-sm text-muted-foreground">وحدة</div>
        </div>
      );
    },
  },
  {
    accessorKey: "minStockLevel",
    header: () => <div className="text-center font-semibold">الحد الأدنى</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold">{row.getValue("minStockLevel")}</div>
        <div className="text-sm text-muted-foreground">وحدة</div>
      </div>
    ),
  },
  {
    accessorKey: "maxStockLevel",
    header: () => <div className="text-center font-semibold">الحد الأقصى</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold">{row.getValue("maxStockLevel")}</div>
        <div className="text-sm text-muted-foreground">وحدة</div>
      </div>
    ),
  },
  {
    accessorKey: "totalValue",
    header: () => (
      <div className="text-center font-semibold">القيمة الإجمالية</div>
    ),
    cell: ({ row }) => {
      const value = row.getValue("totalValue") as number;
      const safeValue =
        isNaN(value) || value === null || value === undefined ? 0 : value;
      return (
        <div className="text-center">
          <div className="font-bold text-green-700">
            EGP {Number(safeValue).toLocaleString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "averageMonthlySales",
    header: () => (
      <div className="text-center font-semibold">المبيعات الشهرية</div>
    ),
    cell: ({ row }) => {
      const sales = row.getValue("averageMonthlySales") as number;
      const safeSales =
        isNaN(sales) || sales === null || sales === undefined ? 0 : sales;
      return (
        <div className="text-center">
          <div className="font-semibold">{safeSales}</div>
          <div className="text-sm text-muted-foreground">وحدة/شهر</div>
        </div>
      );
    },
  },
  {
    accessorKey: "daysOfSupply",
    header: () => <div className="text-center font-semibold">أيام التوريد</div>,
    cell: ({ row }) => {
      const days = row.getValue("daysOfSupply") as number;
      const safeDays =
        isNaN(days) || days === null || days === undefined ? 0 : days;
      const variant =
        safeDays < 15 ? "destructive" : safeDays < 30 ? "secondary" : "outline";
      return (
        <div className="flex justify-center">
          <Badge variant={variant} className="px-3 py-1 shadow-sm font-medium">
            {safeDays} يوم
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "turnoverRate",
    header: () => <div className="text-center font-semibold">معدل الدوران</div>,
    cell: ({ row }) => {
      const rate = row.getValue("turnoverRate") as number;
      const safeRate =
        isNaN(rate) || rate === null || rate === undefined ? 0 : rate;
      return (
        <div className="text-center">
          <div className="font-bold text-blue-700">{safeRate.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">مرة/شهر</div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: () => <div className="text-center font-semibold">الموقع</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
          {row.getValue("location")}
        </code>
      </div>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: () => (
      <div className="text-center font-semibold">تاريخ الانتهاء</div>
    ),
    cell: ({ row }) => {
      const expiry = row.getValue("expiryDate") as string;
      return (
        <div className="text-center">
          <span className="text-sm font-medium bg-gray-50 px-2 py-1 rounded">
            {expiry === "N/A" ? "-" : expiry}
          </span>
        </div>
      );
    },
  },
];
