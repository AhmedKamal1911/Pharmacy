import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DataTablePagination,
  TableStatusControls,
} from "@/components/shared/table-pagination";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { medicines } from "@/data/medicines";
import {
  AlertTriangle,
  Package,
  Filter,
  Search,
  RotateCcw,
  TrendingDown,
  Clock,
} from "lucide-react";

// Mock low stock data - in real app this would come from API
const generateLowStockData = () => {
  return medicines
    .filter((medicine) => medicine.stock < 100) // Items with low stock
    .map((medicine) => ({
      id: medicine.id,
      name: medicine.name,
      category: medicine.category,
      price: medicine.price,
      currentStock: medicine.stock,
      minStockLevel: Math.floor(Math.random() * 50) + 20, // Random minimum stock level
      maxStockLevel: Math.floor(Math.random() * 200) + 100, // Random maximum stock level
      reorderPoint: Math.floor(Math.random() * 30) + 10,
      lastReorderDate: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("ar-EG"),
      supplier: `مورد ${Math.floor(Math.random() * 5) + 1}`,
      daysUntilStockout: Math.floor(Math.random() * 30) + 1,
      status:
        medicine.stock < 20
          ? "critical"
          : medicine.stock < 50
            ? "low"
            : "warning",
      monthlyUsage: Math.floor(Math.random() * 100) + 20,
      recommendedOrder: Math.floor(Math.random() * 100) + 50,
    }))
    .sort((a, b) => a.currentStock - b.currentStock);
};

type LowStockItem = ReturnType<typeof generateLowStockData>[0];

// Calculate summary statistics
const calculateLowStockSummary = (data: LowStockItem[]) => {
  const criticalItems = data.filter(
    (item) => item.status === "critical",
  ).length;
  const lowItems = data.filter((item) => item.status === "low").length;
  const warningItems = data.filter((item) => item.status === "warning").length;
  const totalRecommendedOrder = data.reduce(
    (sum, item) => sum + item.recommendedOrder,
    0,
  );

  return {
    totalProducts: data.length,
    criticalItems,
    lowItems,
    warningItems,
    totalRecommendedOrder,
    averageDaysUntilStockout:
      data.length > 0
        ? Math.round(
            data.reduce((sum, item) => sum + item.daysUntilStockout, 0) /
              data.length,
          )
        : 0,
  };
};

const columns: ColumnDef<LowStockItem>[] = [
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold">الحالة</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        critical: {
          variant: "destructive" as const,
          text: "حرج",
          icon: AlertTriangle,
          bgColor: "bg-red-50",
        },
        low: {
          variant: "secondary" as const,
          text: "منخفض",
          icon: AlertTriangle,
          bgColor: "bg-orange-50",
        },
        warning: {
          variant: "outline" as const,
          text: "تحذير",
          icon: AlertTriangle,
          bgColor: "bg-yellow-50",
        },
      };

      const config =
        statusConfig[status as keyof typeof statusConfig] ||
        statusConfig.warning;
      const Icon = config.icon;

      return (
        <div className="flex justify-center">
          <Badge
            variant={config.variant}
            className={`flex items-center gap-1.5 w-fit px-3 py-1 shadow-sm ${config.bgColor}`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="font-medium">{config.text}</span>
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
      const stockColor =
        stock < 20
          ? "text-red-600"
          : stock < 50
            ? "text-orange-600"
            : "text-yellow-600";

      return (
        <div className="text-center">
          <div className={`font-semibold ${stockColor}`}>
            {stock.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">وحدة</div>
        </div>
      );
    },
  },
  {
    accessorKey: "stockLevels",
    header: () => (
      <div className="text-center font-semibold">مستويات المخزون</div>
    ),
    cell: ({ row }) => {
      const minStock = row.original.minStockLevel;
      const reorderPoint = row.original.reorderPoint;

      return (
        <div className="text-center">
          <div className="text-xs text-muted-foreground">دون: {minStock}</div>
          <div className="text-xs text-blue-600 font-medium">
            إعادة: {reorderPoint}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "daysUntilStockout",
    header: () => (
      <div className="text-center font-semibold">الأيام المتبقية</div>
    ),
    cell: ({ row }) => {
      const days = row.getValue("daysUntilStockout") as number;
      const daysColor =
        days < 7
          ? "text-red-600"
          : days < 14
            ? "text-orange-600"
            : "text-yellow-600";

      return (
        <div className="flex justify-center">
          <div className="text-center">
            <div className={`font-semibold ${daysColor}`}>{days}</div>
            <div className="text-xs text-muted-foreground">يوم</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "monthlyUsage",
    header: () => (
      <div className="text-center font-semibold">الاستخدام الشهري</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold text-blue-700">
          {row.getValue("monthlyUsage")}
        </div>
        <div className="text-sm text-muted-foreground">وحدة/شهر</div>
      </div>
    ),
  },
  {
    accessorKey: "recommendedOrder",
    header: () => (
      <div className="text-center font-semibold">الكمية الموصى بها</div>
    ),
    cell: ({ row }) => {
      const quantity = row.getValue("recommendedOrder") as number;
      return (
        <div className="flex justify-center">
          <Badge
            variant="default"
            className="bg-green-600 hover:bg-green-700 px-3 py-1"
          >
            {quantity.toLocaleString()} وحدة
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "supplier",
    header: () => <div className="text-center font-semibold">المورد</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-medium text-gray-700">
          {row.getValue("supplier")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "lastReorderDate",
    header: () => <div className="text-center font-semibold">آخر طلب</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <div className="text-sm text-gray-600">
          {row.getValue("lastReorderDate")}
        </div>
      </div>
    ),
  },
];

export default function LowStockPage() {
  const [data] = useState<LowStockItem[]>(generateLowStockData());
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const categoryMatch =
        selectedCategory === "all" || item.category === selectedCategory;
      const statusMatch =
        selectedStatus === "all" || item.status === selectedStatus;
      const searchMatch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && statusMatch && searchMatch;
    });
  }, [data, selectedCategory, selectedStatus, searchQuery]);

  const summary = useMemo(
    () => calculateLowStockSummary(filteredData),
    [filteredData],
  );

  const handleReset = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSearchQuery("");
  };

  // Summary Cards Component
  const SummaryCards = () => (
    <>
      <Card className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">
              إجمالي الأصناف الناقصة
            </p>
            <p className="text-3xl font-bold mt-1">{summary.totalProducts}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">أصناف حرجة</p>
            <p className="text-3xl font-bold mt-1">{summary.criticalItems}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <TrendingDown className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">
              الكمية الموصى بها
            </p>
            <p className="text-3xl font-bold mt-1">
              {summary.totalRecommendedOrder.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Package className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">
              متوسط الأيام المتبقية
            </p>
            <p className="text-3xl font-bold mt-1">
              {summary.averageDaysUntilStockout}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Clock className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>
    </>
  );

  // Filters Component
  const FiltersSection = () => {
    const categories = Array.from(new Set(data.map((item) => item.category)));
    const hasActiveFilters =
      selectedCategory !== "all" || selectedStatus !== "all" || searchQuery;

    return (
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md">
              <Filter className="h-3.5 w-3.5" />
              <span className="font-medium text-sm">البحث والتصفية</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {data.length} صنف
            </div>
          </div>

          {/* Active Filters Indicator */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">فلاتر نشطة:</span>
              <div className="flex gap-0.5">
                {selectedCategory !== "all" && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    فئة
                  </span>
                )}
                {selectedStatus !== "all" && (
                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                    حالة
                  </span>
                )}
                {searchQuery && (
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                    بحث
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters Row */}
        <div className="flex gap-2 flex-wrap">
          {/* Search - takes more space */}
          <div className="col-span-12 lg:col-span-5">
            <div className="relative">
              <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="ابحث عن اسم الدواء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-white rounded-md"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-white rounded-md">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-white rounded-md">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="critical">🔴 حرج</SelectItem>
                <SelectItem value="low">🟠 منخفض</SelectItem>
                <SelectItem value="warning">🟡 تحذير</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-1">
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-9 w-full border-gray-300 hover:bg-gray-50 hover:text-gray-700 bg-white rounded-md transition-all duration-200 group px-2"
            >
              اعادة تعيين
              <RotateCcw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-300" />
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            إجمالي{" "}
            <span className="font-semibold text-gray-800">{data.length}</span>{" "}
            صنف •
            <span className="font-semibold text-red-600 mr-1">
              {filteredData.length}
            </span>
            نتيجة
          </div>
        </div>
      </div>
    );
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-10">
        <PageHeader
          title="الأصناف الناقصة"
          description="عرض الأدوية التي تحتاج إلى إعادة طلب مع تحليل المخزون والتوصيات"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCards />
        </div>
      </div>

      {/* Table with integrated filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <Card className="border-0 shadow-none">
          <div className="p-6 space-y-4">
            {/* Filters Section */}
            <FiltersSection />

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        لا توجد بيانات
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="space-y-3">
              <TableStatusControls table={table} />
              <div className="flex items-center justify-center">
                <DataTablePagination table={table} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
