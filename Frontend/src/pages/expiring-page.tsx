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
  Filter,
  Search,
  RotateCcw,
  Calendar,
  TrendingDown,
  Clock,
} from "lucide-react";

// Mock expiring data - in real app this would come from API
const generateExpiringData = () => {
  const today = new Date();

  return medicines
    .filter((medicine) =>
      medicine.variants.some((variant) => variant.expiryDate),
    )
    .map((medicine) => {
      const variantWithExpiry = medicine.variants.find((v) => v.expiryDate);
      if (!variantWithExpiry?.expiryDate) return null;

      const [month, year] = variantWithExpiry.expiryDate.split("/");
      const expiryDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        id: medicine.id,
        name: medicine.name,
        category: medicine.category,
        price: medicine.variants[0]?.price || 0,
        currentStock: medicine.variants.reduce(
          (sum, variant) => sum + variant.stock,
          0,
        ),
        expiryDate: variantWithExpiry.expiryDate,
        daysUntilExpiry: Math.max(0, daysUntilExpiry),
        batchNumber:
          medicine.variants[0]?.batchNumber ||
          `B${Math.floor(Math.random() * 10000)}`,
        manufacturer: `شركة ${Math.floor(Math.random() * 5) + 1}`,
        storageCondition: Math.random() > 0.5 ? "درجة حرارة الغرفة" : "ثلاجة",
        totalValue:
          (medicine.variants[0]?.price || 0) *
          medicine.variants.reduce((sum, variant) => sum + variant.stock, 0),
        lastInspection: new Date(
          today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString("ar-EG"),
        status:
          daysUntilExpiry <= 7
            ? "critical"
            : daysUntilExpiry <= 30
              ? "warning"
              : "soon",
        recommendedAction:
          daysUntilExpiry <= 7
            ? "إزالة فورية"
            : daysUntilExpiry <= 30
              ? "تخفيض السعر"
              : "مراقبة",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .filter((item) => item.daysUntilExpiry <= 90)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
};

type ExpiringItem = ReturnType<typeof generateExpiringData>[0];

// Calculate summary statistics
const calculateExpiringSummary = (data: ExpiringItem[]) => {
  const criticalItems = data.filter(
    (item) => item.status === "critical",
  ).length;
  const warningItems = data.filter((item) => item.status === "warning").length;
  const soonItems = data.filter((item) => item.status === "soon").length;
  const totalValue = data.reduce((sum, item) => sum + item.totalValue, 0);
  const totalQuantity = data.reduce((sum, item) => sum + item.currentStock, 0);

  return {
    totalProducts: data.length,
    criticalItems,
    warningItems,
    soonItems,
    totalValue,
    totalQuantity,
    averageDaysUntilExpiry:
      data.length > 0
        ? Math.round(
            data.reduce((sum, item) => sum + item.daysUntilExpiry, 0) /
              data.length,
          )
        : 0,
  };
};

const columns: ColumnDef<ExpiringItem>[] = [
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold">الحالة</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        critical: {
          variant: "destructive" as const,
          text: "منتهي قريباً",
          icon: AlertTriangle,
          bgColor: "bg-red-50",
        },
        warning: {
          variant: "secondary" as const,
          text: "ينتهي خلال 30 يوم",
          icon: AlertTriangle,
          bgColor: "bg-orange-50",
        },
        soon: {
          variant: "outline" as const,
          text: "ينتهي قريباً",
          icon: AlertTriangle,
          bgColor: "bg-yellow-50",
        },
      };

      const config =
        statusConfig[status as keyof typeof statusConfig] || statusConfig.soon;
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
    accessorKey: "expiryDate",
    header: () => (
      <div className="text-center font-semibold">تاريخ الانتهاء</div>
    ),
    cell: ({ row }) => {
      const days = row.original.daysUntilExpiry;
      const dateColor =
        days <= 7
          ? "text-red-600"
          : days <= 30
            ? "text-orange-600"
            : "text-yellow-600";

      return (
        <div className="text-center">
          <div className={`font-semibold ${dateColor}`}>
            {row.getValue("expiryDate")}
          </div>
          <div className="text-sm text-muted-foreground">{days} يوم متبقي</div>
        </div>
      );
    },
  },
  {
    accessorKey: "currentStock",
    header: () => <div className="text-center font-semibold">الكمية</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold text-blue-700">
          {row.getValue("currentStock")}
        </div>
        <div className="text-sm text-muted-foreground">وحدة</div>
      </div>
    ),
  },
  {
    accessorKey: "totalValue",
    header: () => (
      <div className="text-center font-semibold">القيمة الإجمالية</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold text-green-700">
          EGP {Number(row.getValue("totalValue")).toLocaleString()}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "batchNumber",
    header: () => <div className="text-center font-semibold">رقم الدفعة</div>,
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm font-medium">
        {row.getValue("batchNumber")}
      </div>
    ),
  },
  {
    accessorKey: "manufacturer",
    header: () => (
      <div className="text-center font-semibold">الشركة المصنعة</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-medium text-gray-700">
          {row.getValue("manufacturer")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "storageCondition",
    header: () => <div className="text-center font-semibold">شروط التخزين</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline" className="px-3 py-1">
          {row.getValue("storageCondition")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "recommendedAction",
    header: () => (
      <div className="text-center font-semibold">الإجراء الموصى به</div>
    ),
    cell: ({ row }) => {
      const action = row.getValue("recommendedAction") as string;
      const actionConfig = {
        "إزالة فورية": {
          variant: "destructive" as const,
          bgColor: "bg-red-50",
        },
        "تخفيض السعر": {
          variant: "secondary" as const,
          bgColor: "bg-orange-50",
        },
        مراقبة: {
          variant: "outline" as const,
          bgColor: "bg-yellow-50",
        },
      };

      const config =
        actionConfig[action as keyof typeof actionConfig] ||
        actionConfig["مراقبة"];

      return (
        <div className="text-center">
          <Badge
            variant={config.variant}
            className={`px-3 py-1 shadow-sm ${config.bgColor}`}
          >
            {action}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "lastInspection",
    header: () => <div className="text-center font-semibold">آخر فحص</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <div className="text-sm text-gray-600">
          {row.getValue("lastInspection")}
        </div>
      </div>
    ),
  },
];

export default function ExpiringPage() {
  const [data] = useState<ExpiringItem[]>(generateExpiringData());
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [daysFilter, setDaysFilter] = useState<string>("30");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const categoryMatch =
        selectedCategory === "all" || item.category === selectedCategory;
      const statusMatch =
        selectedStatus === "all" || item.status === selectedStatus;
      const daysMatch =
        daysFilter === "all" ||
        (daysFilter === "7" && item.daysUntilExpiry <= 7) ||
        (daysFilter === "30" && item.daysUntilExpiry <= 30) ||
        (daysFilter === "90" && item.daysUntilExpiry <= 90);
      const searchMatch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && statusMatch && daysMatch && searchMatch;
    });
  }, [data, selectedCategory, selectedStatus, daysFilter, searchQuery]);

  const summary = useMemo(
    () => calculateExpiringSummary(filteredData),
    [filteredData],
  );

  const handleReset = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
    setDaysFilter("30");
    setSearchQuery("");
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

  const categories = Array.from(new Set(data.map((item) => item.category)));

  // Summary Cards Component
  const SummaryCards = () => (
    <>
      <Card className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">
              إجمالي الأصناف المنتهية
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
            <p className="text-orange-100 text-sm font-medium">
              منتهية خلال 7 أيام
            </p>
            <p className="text-3xl font-bold mt-1">{summary.criticalItems}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <TrendingDown className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">
              القيمة الإجمالية المعرضة للخطر
            </p>
            <p className="text-3xl font-bold mt-1">
              EGP {summary.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Calendar className="h-8 w-8 text-white" />
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
              {summary.averageDaysUntilExpiry}
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
    const hasActiveFilters =
      selectedCategory !== "all" ||
      selectedStatus !== "all" ||
      daysFilter !== "30" ||
      searchQuery;

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
                {daysFilter !== "30" && (
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    فترة
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
                <SelectItem value="critical">🔴 منتهي قريباً</SelectItem>
                <SelectItem value="warning">🟠 ينتهي خلال 30 يوم</SelectItem>
                <SelectItem value="soon">🟡 ينتهي قريباً</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Days Filter */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <Select value={daysFilter} onValueChange={setDaysFilter}>
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-white rounded-md">
                <SelectValue placeholder="فترة الانتهاء" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">خلال 7 أيام</SelectItem>
                <SelectItem value="30">خلال 30 يوم</SelectItem>
                <SelectItem value="90">خلال 90 يوم</SelectItem>
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

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-10">
        <PageHeader
          title="الأصناف المنتهية"
          description="عرض الأدوية التي ستنتهي صلاحيتها خلال 30 يوم مع التوصيات اللازمة"
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
