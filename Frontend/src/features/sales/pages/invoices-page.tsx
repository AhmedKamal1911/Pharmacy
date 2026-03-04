import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  FileText,
  Eye,
  User,
  CreditCard,
  Search,
  Filter,
  RotateCcw,
  DollarSign,
  Receipt,
  AlertCircle,
  X,
} from "lucide-react";

// Mock invoice data - in real app this would come from API
const generateInvoiceData = () => {
  const customers = [
    "أحمد محمد",
    "مريم أحمد",
    "خالد عبدالله",
    "فاطمة علي",
    "عمر خالد",
  ];
  const paymentMethods = ["نقدي", "بطاقة ائتمان", "تحويل بنكي"];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  return Array.from({ length: 15 }, (_, index) => {
    const total = Math.floor(Math.random() * 2000) + 100;
    const paid = Math.floor(Math.random() * total);
    const remaining = total - paid;

    // Randomly assign dates (some today, some yesterday, some two days ago)
    const dateOptions = [today, yesterday, twoDaysAgo];
    const invoiceDate =
      dateOptions[Math.floor(Math.random() * dateOptions.length)];

    return {
      id: `INV-${String(index + 1).padStart(4, "0")}`,
      customerName: customers[Math.floor(Math.random() * customers.length)],
      date: invoiceDate.toLocaleDateString("ar-EG"),
      fullDate: invoiceDate, // Store full date for filtering
      time: `${Math.floor(Math.random() * 12) + 8}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      total,
      paid,
      remaining,
      status:
        remaining === 0 ? "مدفوعة" : remaining < total ? "جزئية" : "معلقة",
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      itemsCount: Math.floor(Math.random() * 10) + 1,
      discount: Math.floor(Math.random() * 100),
      tax: Math.floor(total * 0.14),
      netTotal:
        total + Math.floor(total * 0.14) - Math.floor(Math.random() * 100),
      salesperson: `موظف ${Math.floor(Math.random() * 3) + 1}`,
      notes: Math.random() > 0.5 ? "ملاحظات خاصة" : "",
    };
  });
};

type Invoice = ReturnType<typeof generateInvoiceData>[0] & {
  fullDate: Date;
};

type InvoiceSummary = {
  totalInvoices: number;
  totalRevenue: number;
  totalPending: number;
  paidInvoices: number;
};

type InvoiceItem = {
  id: string;
  medicineCode: string;
  medicineName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  discountPercentage: number;
  expiryDate: string;
  batchNumber: string;
};

export default function InvoicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data] = useState<Invoice[]>(generateInvoiceData());
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("date");

  // Check if we should show only today's invoices
  const showTodayOnly = searchParams.get("today") === "true";

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div className="text-center font-semibold">رقم الفاتورة</div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-mono font-semibold text-blue-700">
            {row.getValue("id")}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: () => <div className="text-start font-semibold">اسم العميل</div>,
      cell: ({ row }) => (
        <div className="text-start">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-gray-900">
              {row.getValue("customerName")}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: () => <div className="text-center font-semibold">التاريخ</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-semibold">{row.getValue("date")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.time}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: () => <div className="text-center font-semibold">الإجمالي</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-bold text-lg text-gray-900">
            EGP {Number(row.getValue("total")).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "paid",
      header: () => <div className="text-center font-semibold">المدفوع</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-bold text-lg text-green-600">
            EGP {Number(row.getValue("paid")).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "remaining",
      header: () => <div className="text-center font-semibold">المتبقي</div>,
      cell: ({ row }) => {
        const remaining = row.getValue("remaining") as number;
        return (
          <div className="text-center">
            <div
              className={`font-bold text-lg ${remaining > 0 ? "text-red-600" : "text-green-600"}`}
            >
              EGP {remaining.toLocaleString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center font-semibold">الحالة</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex justify-center">
            <Badge
              variant={
                status === "مدفوعة"
                  ? "default"
                  : status === "جزئية"
                    ? "secondary"
                    : "destructive"
              }
              className="flex items-center gap-1.5 w-fit px-3 py-1 shadow-sm font-medium"
            >
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "paymentMethod",
      header: () => (
        <div className="text-center font-semibold">طريقة الدفع</div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.getValue("paymentMethod")}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center font-semibold">الإجراءات</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedInvoice(row.original);
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Eye className="h-4 w-4" />
              التفاصيل
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredData = useMemo(() => {
    const filtered = data.filter((invoice) => {
      // Check if today filter is active
      if (showTodayOnly) {
        const today = new Date();
        const invoiceDate = new Date(invoice.fullDate);
        // Check if invoice is from today (same day, month, year)
        if (invoiceDate.toDateString() !== today.toDateString()) {
          return false;
        }
      }

      const statusMatch =
        selectedStatus === "all" || invoice.status === selectedStatus;
      const paymentMethodMatch =
        selectedPaymentMethod === "all" ||
        invoice.paymentMethod === selectedPaymentMethod;
      const searchMatch =
        !searchQuery.trim() ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && paymentMethodMatch && searchMatch;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "total":
          return b.total - a.total;
        case "customerName":
          return a.customerName.localeCompare(b.customerName);
        case "id":
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    return sorted;
  }, [
    data,
    selectedStatus,
    selectedPaymentMethod,
    searchQuery,
    sortBy,
    showTodayOnly,
  ]);

  const summary: InvoiceSummary = useMemo(
    () => ({
      totalInvoices: data.length,
      totalRevenue: data.reduce((sum, invoice) => sum + invoice.paid, 0),
      totalPending: data.reduce((sum, invoice) => sum + invoice.remaining, 0),
      paidInvoices: data.filter((invoice) => invoice.status === "مدفوعة")
        .length,
    }),
    [data],
  );

  const handleReset = () => {
    setSelectedStatus("all");
    setSelectedPaymentMethod("all");
    setSearchQuery("");
    setSortBy("date");
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
  const SummaryCards = ({ summary }: { summary: InvoiceSummary }) => (
    <>
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">إجمالي الفواتير</p>
            <p className="text-3xl font-bold mt-1">{summary.totalInvoices}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">
              الإيرادات المدفوعة
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
              المبلغ المتبقي
            </p>
            <p className="text-3xl font-bold mt-1">
              EGP {summary.totalPending.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">
              الفواتير المدفوعة
            </p>
            <p className="text-3xl font-bold mt-1">{summary.paidInvoices}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Receipt className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>
    </>
  );

  // Filters Component
  const FiltersSection = ({
    data,
    selectedStatus,
    selectedPaymentMethod,
    searchQuery,
    sortBy,
    setSelectedStatus,
    setSelectedPaymentMethod,
    setSearchQuery,
    setSortBy,
    filteredData,
    handleReset,
  }: {
    data: Invoice[];
    selectedStatus: string;
    selectedPaymentMethod: string;
    searchQuery: string;
    sortBy: string;
    setSelectedStatus: (value: string) => void;
    setSelectedPaymentMethod: (value: string) => void;
    setSearchQuery: (value: string) => void;
    setSortBy: (value: string) => void;
    filteredData: Invoice[];
    handleReset: () => void;
  }) => {
    const paymentMethods = Array.from(
      new Set(data.map((item) => item.paymentMethod)),
    );
    const hasActiveFilters =
      selectedStatus !== "all" ||
      selectedPaymentMethod !== "all" ||
      searchQuery ||
      sortBy !== "date";

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
              {data.length} فاتورة
            </div>
          </div>

          {/* Active Filters Indicator */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">فلاتر نشطة:</span>
              <div className="flex gap-0.5">
                {selectedStatus !== "all" && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    حالة
                  </span>
                )}
                {selectedPaymentMethod !== "all" && (
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    دفع
                  </span>
                )}
                {searchQuery && (
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                    بحث
                  </span>
                )}
                {sortBy !== "date" && (
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
                placeholder="ابحث عن رقم الفاتورة أو اسم العميل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="مدفوعة">مدفوعة</SelectItem>
                <SelectItem value="جزئية">جزئية</SelectItem>
                <SelectItem value="معلقة">معلقة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method Filter */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <Select
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
            >
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md">
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الطرق</SelectItem>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
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
                <SelectItem value="date">📅 التاريخ</SelectItem>
                <SelectItem value="total">💰 الإجمالي</SelectItem>
                <SelectItem value="customerName">👤 العميل</SelectItem>
                <SelectItem value="id">🔢 الرقم</SelectItem>
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
            فاتورة •
            <span className="font-semibold text-blue-600 mr-1">
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
          title={showTodayOnly ? "فواتير اليوم" : "جميع الفواتير"}
          description={
            showTodayOnly
              ? "عرض جميع الفواتير الصادرة اليوم مع إمكانية عرض التفاصيل"
              : "عرض جميع الفواتير مع إمكانية عرض التفاصيل"
          }
          actions={
            <Button
              onClick={() => {
                if (showTodayOnly) {
                  searchParams.delete("today");
                  setSearchParams(searchParams);
                } else {
                  searchParams.set("today", "true");
                  setSearchParams(searchParams);
                }
              }}
              variant={showTodayOnly ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {showTodayOnly ? "جميع الفواتير" : "فواتير اليوم"}
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCards summary={summary} />
        </div>
      </div>

      {/* Table with integrated filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <Card className="border-0 shadow-none">
          <div className="p-6 space-y-4">
            {/* Filters Section */}
            <FiltersSection
              data={data}
              selectedStatus={selectedStatus}
              selectedPaymentMethod={selectedPaymentMethod}
              searchQuery={searchQuery}
              sortBy={sortBy}
              setSelectedStatus={setSelectedStatus}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              setSearchQuery={setSearchQuery}
              setSortBy={setSortBy}
              filteredData={filteredData}
              handleReset={handleReset}
            />

            {/* Table */}
            <div className="space-y-4">
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
                          لا توجد فواتير اليوم
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <TableStatusControls table={table} />
              <div className="flex items-center justify-center">
                <DataTablePagination table={table} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <InvoiceDetailsDialog
        invoice={selectedInvoice}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedInvoice(null);
        }}
      />
    </div>
  );
}

// Invoice Details Dialog Component
interface InvoiceDetailsDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

// Realistic mock invoice items - more items for testing scroll
const mockItems: InvoiceItem[] = [
  {
    id: "ITEM-1",
    medicineCode: "MED001",
    medicineName: "بنسيلين 500 مجم",
    quantity: 2,
    unit: "كبسولة",
    unitPrice: 45.5,
    totalPrice: 91.0,
    discount: 5.0,
    discountPercentage: 10,
    expiryDate: "12/2025",
    batchNumber: "B2024001",
  },
  {
    id: "ITEM-2",
    medicineCode: "MED002",
    medicineName: "باراسيتامول 500 مجم",
    quantity: 1,
    unit: "شريط",
    unitPrice: 25.0,
    totalPrice: 25.0,
    discount: 0.0,
    discountPercentage: 0,
    expiryDate: "08/2025",
    batchNumber: "B2024002",
  },
  {
    id: "ITEM-3",
    medicineCode: "MED003",
    medicineName: "أموكسيسيلين 250 مجم",
    quantity: 1,
    unit: "زجاجة",
    unitPrice: 35.75,
    totalPrice: 35.75,
    discount: 2.0,
    discountPercentage: 5,
    expiryDate: "10/2025",
    batchNumber: "B2024003",
  },
  {
    id: "ITEM-4",
    medicineCode: "MED004",
    medicineName: "فيتامين د 1000 وحدة",
    quantity: 3,
    unit: "علبة",
    unitPrice: 120.0,
    totalPrice: 360.0,
    discount: 18.0,
    discountPercentage: 15,
    expiryDate: "06/2026",
    batchNumber: "B2024004",
  },
  {
    id: "ITEM-5",
    medicineCode: "MED005",
    medicineName: "كورتيزون كريم 1%",
    quantity: 1,
    unit: "أنبوبة",
    unitPrice: 28.9,
    totalPrice: 28.9,
    discount: 0.0,
    discountPercentage: 0,
    expiryDate: "03/2025",
    batchNumber: "B2024005",
  },
  {
    id: "ITEM-6",
    medicineCode: "MED006",
    medicineName: "أسبرين 100 مجم",
    quantity: 2,
    unit: "علبة",
    unitPrice: 15.5,
    totalPrice: 31.0,
    discount: 3.0,
    discountPercentage: 10,
    expiryDate: "09/2025",
    batchNumber: "B2024006",
  },
  {
    id: "ITEM-7",
    medicineCode: "MED007",
    medicineName: "فيتامين سي 500 مجم",
    quantity: 1,
    unit: "عبوة",
    unitPrice: 45.0,
    totalPrice: 45.0,
    discount: 0.0,
    discountPercentage: 0,
    expiryDate: "11/2025",
    batchNumber: "B2024007",
  },
  {
    id: "ITEM-8",
    medicineCode: "MED008",
    medicineName: "مضاد حيوي واسع المجال",
    quantity: 1,
    unit: "زجاجة",
    unitPrice: 85.0,
    totalPrice: 85.0,
    discount: 8.5,
    discountPercentage: 10,
    expiryDate: "07/2025",
    batchNumber: "B2024008",
  },
  {
    id: "ITEM-9",
    medicineCode: "MED009",
    medicineName: "قطرة للعين",
    quantity: 2,
    unit: "قطرة",
    unitPrice: 22.5,
    totalPrice: 45.0,
    discount: 0.0,
    discountPercentage: 0,
    expiryDate: "04/2025",
    batchNumber: "B2024009",
  },
  {
    id: "ITEM-10",
    medicineCode: "MED010",
    medicineName: "مرهم جلدي",
    quantity: 1,
    unit: "أنبوبة",
    unitPrice: 35.0,
    totalPrice: 35.0,
    discount: 3.5,
    discountPercentage: 10,
    expiryDate: "12/2025",
    batchNumber: "B2024010",
  },
  {
    id: "ITEM-11",
    medicineCode: "MED011",
    medicineName: "أقراص الحديد",
    quantity: 2,
    unit: "عبوة",
    unitPrice: 55.0,
    totalPrice: 110.0,
    discount: 5.5,
    discountPercentage: 10,
    expiryDate: "08/2026",
    batchNumber: "B2024011",
  },
  {
    id: "ITEM-12",
    medicineCode: "MED012",
    medicineName: "شراب السعال",
    quantity: 1,
    unit: "زجاجة",
    unitPrice: 28.0,
    totalPrice: 28.0,
    discount: 0.0,
    discountPercentage: 0,
    expiryDate: "05/2025",
    batchNumber: "B2024012",
  },
  {
    id: "ITEM-13",
    medicineCode: "MED013",
    medicineName: "مضاد حيوي واسع المجال",
    quantity: 1,
    unit: "زجاجة",
    unitPrice: 85.0,
    totalPrice: 85.0,
    discount: 8.5,
    discountPercentage: 10,
    expiryDate: "07/2025",
    batchNumber: "B2024008",
  },
  {
    id: "ITEM-14",
    medicineCode: "MED014",
    medicineName: "قطرة للعين",
    quantity: 2,
    unit: "قطرة",
    unitPrice: 22.5,
    totalPrice: 45.0,
    discount: 0.0,
    discountPercentage: 0,
    expiryDate: "04/2025",
    batchNumber: "B2024009",
  },
  {
    id: "ITEM-15",
    medicineCode: "MED015",
    medicineName: "مرهم جلدي",
    quantity: 1,
    unit: "أنبوبة",
    unitPrice: 35.0,
    totalPrice: 35.0,
    discount: 3.5,
    discountPercentage: 10,
    expiryDate: "12/2025",
    batchNumber: "B2024010",
  },
  {
    id: "ITEM-16",
    medicineCode: "MED016",
    medicineName: "أقراص الحديد",
    quantity: 2,
    unit: "عبوة",
    unitPrice: 55.0,
    totalPrice: 110.0,
    discount: 5.5,
    discountPercentage: 10,
    expiryDate: "08/2026",
    batchNumber: "B2024011",
  },
  {
    id: "ITEM-17",
    medicineCode: "MED017",
    medicineName: "شراب السعال",
    quantity: 1,
    unit: "زجاجة",
    unitPrice: 28.0,
    totalPrice: 28.0,
    discount: 0.0,
    discountPercentage: 0,
    expiryDate: "05/2025",
    batchNumber: "B2024012",
  },
  {
    id: "ITEM-18",
    medicineCode: "MED018",
    medicineName: "مضاد حيوي واسع المجال",
    quantity: 1,
    unit: "زجاجة",
    unitPrice: 85.0,
    totalPrice: 85.0,
    discount: 8.5,
    discountPercentage: 10,
    expiryDate: "07/2025",
    batchNumber: "B2024008",
  },
  {
    id: "ITEM-19",
    medicineCode: "MED019",
    medicineName: "قطرة للعين",
    quantity: 2,
    unit: "قطرة",
    unitPrice: 22.5,
    totalPrice: 45.0,
    discount: 0.0,
    discountPercentage: 0,
    expiryDate: "04/2025",
    batchNumber: "B2024009",
  },
  {
    id: "ITEM-20",
    medicineCode: "MED020",
    medicineName: "مرهم جلدي",
    quantity: 1,
    unit: "أنبوبة",
    unitPrice: 35.0,
    totalPrice: 35.0,
    discount: 3.5,
    discountPercentage: 10,
    expiryDate: "12/2025",
    batchNumber: "B2024010",
  },
];
export function InvoiceDetailsDialog({
  invoice,
  isOpen,
  onClose,
}: InvoiceDetailsDialogProps) {
  if (!invoice || !isOpen) return null;

  // استخدام الداتا الحقيقية من الفاتورة، مع توفير مصفوفة فارغة كاحتياطي
  const items: InvoiceItem[] = mockItems;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2"
      onClick={onClose}
    >
      <div
        className="bg-gray-50 rounded-2xl shadow-2xl w-[95vw] h-[90vh] md:w-[90vw] md:h-[85vh] lg:w-[85vw] lg:h-[85vh] max-w-7xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">تفاصيل الفاتورة</h2>
              <p className="text-blue-100 text-sm font-mono tracking-wider">
                #{invoice.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 hover:text-red-200 p-2 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content - takes remaining height */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full" dir="rtl">
            <div className="p-4 space-y-4">
              {/* Basic Info */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        العميل
                      </p>
                      <p className="font-bold text-gray-900 truncate max-w-[120px]">
                        {invoice.customerName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                      <Receipt className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        التاريخ والوقت
                      </p>
                      <p className="font-bold text-gray-900">{invoice.date}</p>
                      <p className="text-xs text-gray-600">{invoice.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        محرر الفاتورة
                      </p>
                      <p className="font-bold text-gray-900">
                        {invoice.salesperson}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                      <CreditCard className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        طريقة الدفع
                      </p>
                      <p className="font-bold text-gray-900">
                        {invoice.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">الإجمالي</p>
                      <p className="text-3xl font-bold font-mono">
                        {invoice.total.toLocaleString()}{" "}
                        <span className="text-sm font-normal">ج.م</span>
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <p className="text-emerald-100 text-sm mb-1">المدفوع</p>
                      <p className="text-3xl font-bold font-mono">
                        {invoice.paid.toLocaleString()}{" "}
                        <span className="text-sm font-normal">ج.م</span>
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <Receipt className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <p className="text-rose-100 text-sm mb-1">المتبقي</p>
                      <p className="text-3xl font-bold font-mono">
                        {invoice.remaining.toLocaleString()}{" "}
                        <span className="text-sm font-normal">ج.م</span>
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-sm">
                <p className="text-sm font-bold text-gray-700">
                  حالة الفاتورة:
                </p>
                <Badge
                  variant={
                    invoice.status === "مدفوعة"
                      ? "default"
                      : invoice.status === "جزئية"
                        ? "secondary"
                        : "destructive"
                  }
                  className="font-bold px-4 py-1 text-sm"
                >
                  {invoice.status}
                </Badge>
              </div>

              {/* Items Table - Enhanced for large data */}
              <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="bg-gray-50/80 px-4 py-3 border-b flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    الأصناف المسجلة
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-white font-bold text-blue-700"
                  >
                    {items.length} أصناف
                  </Badge>
                </div>

                {/* Table Wrapper (handles horizontal scroll on small screens) */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[700px] text-right">
                    {/* Sticky Header with Backdrop Blur */}
                    <thead className="bg-gray-100/80 backdrop-blur-md sticky top-0 z-10 border-b shadow-sm">
                      <tr>
                        <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          كود
                        </th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          اسم الصنف
                        </th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
                          الكمية
                        </th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
                          السعر
                        </th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
                          الخصم
                        </th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-left">
                          الإجمالي
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.length > 0 ? (
                        items.map((item, index) => (
                          <tr
                            key={item.id || index}
                            className="hover:bg-blue-50/50 even:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-2 text-sm font-mono font-bold text-blue-600 whitespace-nowrap">
                              {item.medicineCode}
                            </td>
                            <td className="px-4 py-2 text-sm font-semibold text-gray-900">
                              {item.medicineName}
                            </td>
                            <td className="px-4 py-2 text-sm text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <span className="font-bold text-gray-900 text-base">
                                  {item.quantity}
                                </span>
                                <span className="text-gray-500 text-xs bg-gray-200/70 px-2 py-1 rounded-md">
                                  {item.unit}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-sm text-center font-semibold text-gray-900 whitespace-nowrap">
                              {item.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-sm text-center whitespace-nowrap">
                              {item.discountPercentage > 0 ? (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                                    {item.discountPercentage}%
                                  </span>
                                  <span className="text-red-600 font-bold text-xs">
                                    -{item.discount.toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-400 font-medium">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-left font-bold text-gray-900 whitespace-nowrap">
                              {item.totalPrice.toFixed(2)}{" "}
                              <span className="text-xs text-gray-500 font-normal">
                                ج.م
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-gray-500 font-medium"
                          >
                            لا توجد أصناف في هذه الفاتورة
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-gray-200 px-4 py-2 bg-white shrink-0 flex gap-4">
          <Button
            variant="outline"
            className="flex-1 h-12 font-bold border-2 hover:bg-gray-50 transition-all text-gray-700"
            onClick={onClose}
          >
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
          <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all">
            <Receipt className="h-4 w-4 ml-2" />
            طباعة الفاتورة
          </Button>
        </div>
      </div>
    </div>
  );
}
