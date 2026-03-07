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
  Award,
  TrendingUp,
  Filter,
  Search,
  RotateCcw,
  Package,
  DollarSign,
  BarChart3,
  TrendingDown,
} from "lucide-react";

// Mock sales data - in real app this would come from API
const generateMockSalesData = () => {
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const currentYear = new Date().getFullYear();

  return medicines
    .map((medicine) => ({
      id: medicine.id,
      name: medicine.name,
      category: medicine.category,
      price: medicine.variants[0]?.price || medicine.basePrice || 0,
      totalSales: Math.floor(Math.random() * 1000) + 100,
      totalRevenue: Math.floor(Math.random() * 50000) + 5000,
      averageMonthlySales: Math.floor(Math.random() * 100) + 20,
      bestMonth: months[Math.floor(Math.random() * 12)],
      bestMonthSales: Math.floor(Math.random() * 200) + 50,
      year: currentYear,
      stock: medicine.variants[0]?.stock || 0,
      trend:
        Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable",
      trendPercentage: Math.floor(Math.random() * 40) - 10,
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 10);
};

type BestSellingMedicine = ReturnType<typeof generateMockSalesData>[0];

// Calculate summary statistics
const calculateSalesSummary = (data: BestSellingMedicine[]) => {
  return {
    totalProducts: data.length,
    totalSales: data.reduce((sum, item) => sum + item.totalSales, 0),
    totalRevenue: data.reduce((sum, item) => sum + item.totalRevenue, 0),
    averageRevenuePerProduct:
      data.length > 0
        ? data.reduce((sum, item) => sum + item.totalRevenue, 0) / data.length
        : 0,
  };
};

const columns: ColumnDef<BestSellingMedicine>[] = [
  {
    accessorKey: "rank",
    header: () => <div className="text-center font-semibold">الترتيب</div>,
    cell: ({ row }) => {
      const rank = row.index + 1;
      return (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            {rank <= 3 && (
              <Award
                className={`h-4 w-4 ${
                  rank === 1
                    ? "text-yellow-500"
                    : rank === 2
                      ? "text-gray-400"
                      : "text-orange-600"
                }`}
              />
            )}
            <span className="font-semibold">{rank}</span>
          </div>
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
    accessorKey: "totalSales",
    header: () => (
      <div className="text-center font-semibold">إجمالي المبيعات</div>
    ),
    cell: ({ row }) => {
      const sales = row.getValue("totalSales") as number;
      return (
        <div className="text-center">
          <div className="font-semibold text-blue-700">
            {sales.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">وحدة</div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalRevenue",
    header: () => (
      <div className="text-center font-semibold">إجمالي الإيرادات</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold text-green-700">
          EGP {Number(row.getValue("totalRevenue")).toLocaleString()}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "averageMonthlySales",
    header: () => (
      <div className="text-center font-semibold">المبيعات الشهرية</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold">
          {row.getValue("averageMonthlySales")}
        </div>
        <div className="text-sm text-muted-foreground">وحدة/شهر</div>
      </div>
    ),
  },
  {
    accessorKey: "bestMonth",
    header: () => <div className="text-center font-semibold">أفضل شهر</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold">{row.getValue("bestMonth")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.bestMonthSales} وحدة
        </div>
      </div>
    ),
  },
  {
    accessorKey: "trend",
    header: () => <div className="text-center font-semibold">الاتجاه</div>,
    cell: ({ row }) => {
      const trend = row.getValue("trend") as string;
      const percentage = row.original.trendPercentage;

      const trendConfig = {
        up: {
          icon: TrendingUp,
          variant: "default" as const,
          color: "text-green-700",
        },
        down: {
          icon: TrendingDown,
          variant: "destructive" as const,
          color: "text-red-700",
        },
        stable: {
          icon: TrendingUp,
          variant: "secondary" as const,
          color: "text-gray-700",
        },
      };

      const config =
        trendConfig[trend as keyof typeof trendConfig] || trendConfig.stable;
      const Icon = config.icon;

      return (
        <div className="flex justify-center">
          <Badge
            variant={config.variant}
            className="flex items-center gap-1.5 w-fit px-3 py-1 shadow-sm"
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="font-medium">
              {trend === "up" ? "+" : trend === "down" ? "" : ""}
              {percentage}%
            </span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-center font-semibold">المخزون</div>,
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      const stockColor =
        stock < 50
          ? "text-red-600"
          : stock < 100
            ? "text-orange-600"
            : stock < 200
              ? "text-yellow-600"
              : "text-green-600";

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
];

export default function BestSellingPage() {
  const [data] = useState<BestSellingMedicine[]>(generateMockSalesData());
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("totalSales");

  const filteredData = useMemo(() => {
    const filtered = data.filter((item) => {
      const yearMatch =
        selectedYear === "all" || item.year.toString() === selectedYear;
      const monthMatch =
        selectedMonth === "all" || item.bestMonth === selectedMonth;
      const categoryMatch =
        selectedCategory === "all" || item.category === selectedCategory;
      const searchMatch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return yearMatch && monthMatch && categoryMatch && searchMatch;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "totalSales":
          return b.totalSales - a.totalSales;
        case "totalRevenue":
          return b.totalRevenue - a.totalRevenue;
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return sorted;
  }, [
    data,
    selectedYear,
    selectedMonth,
    selectedCategory,
    searchQuery,
    sortBy,
  ]);

  const summary = useMemo(
    () => calculateSalesSummary(filteredData),
    [filteredData],
  );

  const handleReset = () => {
    setSelectedYear(new Date().getFullYear().toString());
    setSelectedMonth("all");
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("totalSales");
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

  // Summary Cards Component
  const SummaryCards = () => (
    <>
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">إجمالي الأدوية</p>
            <p className="text-3xl font-bold mt-1">{summary.totalProducts}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Package className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">
              إجمالي المبيعات
            </p>
            <p className="text-3xl font-bold mt-1">
              {summary.totalSales.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">
              إجمالي الإيرادات
            </p>
            <p className="text-3xl font-bold mt-1">
              EGP {summary.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">
              متوسط الإيرادات
            </p>
            <p className="text-3xl font-bold mt-1">
              EGP{" "}
              {Math.round(summary.averageRevenuePerProduct).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>
    </>
  );

  // Filters Component
  const FiltersSection = () => {
    const categories = Array.from(new Set(data.map((item) => item.category)));
    const hasActiveFilters =
      selectedYear !== new Date().getFullYear().toString() ||
      selectedMonth !== "all" ||
      selectedCategory !== "all" ||
      searchQuery ||
      sortBy !== "totalSales";

    return (
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md">
              <Filter className="h-3.5 w-3.5" />
              <span className="font-medium text-sm">البحث والتصفية</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {data.length} دواء
            </div>
          </div>

          {/* Active Filters Indicator */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">فلاتر نشطة:</span>
              <div className="flex gap-0.5">
                {selectedYear !== new Date().getFullYear().toString() && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    سنة
                  </span>
                )}
                {selectedMonth !== "all" && (
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    شهر
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                    فئة
                  </span>
                )}
                {searchQuery && (
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                    بحث
                  </span>
                )}
                {sortBy !== "totalSales" && (
                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                    ترتيب
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
                className="w-full pr-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md"
              />
            </div>
          </div>

          {/* Year Filter */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
                <SelectValue placeholder="السنة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل السنوات</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
                <SelectValue placeholder="الشهر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الشهور</SelectItem>
                {months.slice(1).map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
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

          {/* Sort Filter */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
                <SelectValue placeholder="الترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalSales">📊 المبيعات</SelectItem>
                <SelectItem value="totalRevenue">💰 الإيرادات</SelectItem>
                <SelectItem value="name">🔤 اسم</SelectItem>
                <SelectItem value="category">📁 فئة</SelectItem>
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
            دواء •
            <span className="font-semibold text-blue-600 mr-1">
              {filteredData.length}
            </span>
            نتيجة
          </div>
        </div>
      </div>
    );
  };

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );
  const months = [
    "all",
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-10">
        <PageHeader
          title="أفضل الأدوية مبيعاً"
          description="عرض أفضل 10 أدوية من حيث المبيعات مع إمكانية التصفية والبحث"
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
