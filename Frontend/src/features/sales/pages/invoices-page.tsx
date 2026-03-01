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

  return Array.from({ length: 15 }, (_, index) => {
    const total = Math.floor(Math.random() * 2000) + 100;
    const paid = Math.floor(Math.random() * total);
    const remaining = total - paid;

    return {
      id: `INV-${String(index + 1).padStart(4, "0")}`,
      customerName: customers[Math.floor(Math.random() * customers.length)],
      date: new Date().toLocaleDateString("ar-EG"),
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

type Invoice = ReturnType<typeof generateInvoiceData>[0];

type InvoiceSummary = {
  totalInvoices: number;
  totalRevenue: number;
  totalPending: number;
  paidInvoices: number;
};

type InvoiceItem = {
  id: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
};

export default function InvoicesPage() {
  const [data] = useState<Invoice[]>(generateInvoiceData());
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("date");

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
  }, [data, selectedStatus, selectedPaymentMethod, searchQuery, sortBy]);

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
          title="فواتير اليوم"
          description="عرض جميع الفواتير الصادرة اليوم مع إمكانية عرض التفاصيل"
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

function InvoiceDetailsDialog({
  invoice,
  isOpen,
  onClose,
}: InvoiceDetailsDialogProps) {
  if (!invoice) return null;

  if (!isOpen) return null;

  // Static mock invoice items for demonstration
  const mockItems: InvoiceItem[] = [
    {
      id: "ITEM-1",
      medicineName: "دواء 1",
      quantity: 5,
      unitPrice: 120,
      totalPrice: 600,
      discount: 20,
    },
    {
      id: "ITEM-2",
      medicineName: "دواء 2",
      quantity: 3,
      unitPrice: 85,
      totalPrice: 255,
      discount: 15,
    },
    {
      id: "ITEM-3",
      medicineName: "دواء 3",
      quantity: 2,
      unitPrice: 200,
      totalPrice: 400,
      discount: 10,
    },
    {
      id: "ITEM-4",
      medicineName: "دواء 4",
      quantity: 1,
      unitPrice: 350,
      totalPrice: 350,
      discount: 0,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">تفاصيل الفاتورة</h2>
            <span className="text-sm text-gray-500">{invoice.id}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">معلومات العميل</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">الاسم</p>
                  <p className="font-medium">{invoice.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الهاتف</p>
                  <p className="font-medium">+20 123 456 7890</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                  <p className="font-medium">customer@example.com</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">التاريخ</p>
                <p className="font-medium">{invoice.date}</p>
                <p className="text-sm text-gray-600">{invoice.time}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">طريقة الدفع</p>
                <p className="font-medium">{invoice.paymentMethod}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="bg-white border rounded-lg">
              <div className="px-4 py-3 border-b">
                <h3 className="font-medium text-gray-900">العناصر</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">
                      الدواء
                    </th>
                    <th className="text-center px-4 py-2 text-sm font-medium text-gray-700">
                      الكمية
                    </th>
                    <th className="text-center px-4 py-2 text-sm font-medium text-gray-700">
                      السعر
                    </th>
                    <th className="text-center px-4 py-2 text-sm font-medium text-gray-700">
                      الخصم
                    </th>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                      الإجمالي
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{item.medicineName}</td>
                      <td className="px-4 py-2 text-sm text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-sm text-center">
                        EGP {item.unitPrice}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-red-600">
                        EGP {item.discount}
                      </td>
                      <td className="px-4 py-2 text-sm text-left font-medium">
                        EGP {item.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  ملخص الفاتورة
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الإجمالي:</span>
                    <span>EGP {invoice.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الضريبة:</span>
                    <span>EGP {invoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الخصم:</span>
                    <span className="text-red-600">
                      EGP {invoice.discount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">الصافي:</span>
                    <span className="font-bold">
                      EGP {invoice.netTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">حالة الدفع</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الحالة:</span>
                    <Badge
                      variant={
                        invoice.status === "مدفوعة"
                          ? "default"
                          : invoice.status === "جزئية"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المدفوع:</span>
                    <span className="text-green-600">
                      EGP {invoice.paid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المتبقي:</span>
                    <span className="text-red-600">
                      EGP {invoice.remaining.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">ملاحظات</h3>
                <p className="text-sm text-gray-700">{invoice.notes}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="bg-white border-t px-6 py-4">
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              إغلاق
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              طباعة الفاتورة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
