import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SupplierTransactionsTable } from "@/features/suppliers/components/table/supplier-transactions-table";
import { useSupplierTransactions } from "@/features/suppliers/hooks/use-supplier-transactions";
import {
  Download,
  ArrowRight,
  ShoppingCart,
  CreditCard,
  FileText,
  TrendingUp,
  Package,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Percent,
  Receipt,
  Calculator,
} from "lucide-react";

export default function SupplierTransactionsPage() {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();
  const { transactions, summary } = useSupplierTransactions(supplierId);

  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const filteredData = useMemo(() => {
    const filtered = transactions.filter((item) => {
      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;
      const matchesSearch =
        !searchQuery.trim() ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDateFrom =
        !dateFrom || new Date(item.transactionDate) >= dateFrom;
      const matchesDateTo = !dateTo || new Date(item.transactionDate) <= dateTo;
      return (
        matchesType &&
        matchesStatus &&
        matchesSearch &&
        matchesDateFrom &&
        matchesDateTo
      );
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime()
          );
        case "amount":
          return Math.abs(b.amount) - Math.abs(a.amount);
        case "type":
          return a.type.localeCompare(b.type);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [
    transactions,
    selectedType,
    selectedStatus,
    sortBy,
    searchQuery,
    dateFrom,
    dateTo,
  ]);

  const handleReset = () => {
    setSelectedType("all");
    setSelectedStatus("all");
    setSortBy("date");
    setSearchQuery("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case "PAYMENT":
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case "RETURN":
        return <Package className="h-4 w-4 text-orange-600" />;
      case "WITHDRAWAL":
        return <DollarSign className="h-4 w-4 text-purple-600" />;
      case "DISCOUNT":
        return <Percent className="h-4 w-4 text-teal-600" />;
      case "PENALTY":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "CREDIT_NOTE":
        return <FileText className="h-4 w-4 text-indigo-600" />;
      case "DEBIT_NOTE":
        return <Receipt className="h-4 w-4 text-pink-600" />;
      case "SETTLEMENT":
        return <Calculator className="h-4 w-4 text-gray-600" />;
      case "ADJUSTMENT":
        return <RefreshCw className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return "شراء";
      case "PAYMENT":
        return "سداد فاتورة";
      case "RETURN":
        return "مرتجع";
      case "WITHDRAWAL":
        return "سحب بضاعة";
      case "DISCOUNT":
        return "خصم";
      case "PENALTY":
        return "غرامة";
      case "CREDIT_NOTE":
        return "إشعار دائن";
      case "DEBIT_NOTE":
        return "إشارة مدين";
      case "SETTLEMENT":
        return "تسوية";
      case "ADJUSTMENT":
        return "تعديل";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-10">
        <PageHeader
          title="معاملات المورد"
          description="عرض تفاصيل المعاملات المالية مع المورد"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={18} />
                تصدير
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowRight size={18} />
                رجوع
              </Button>
            </div>
          }
        />

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-bold text-blue-800">الرصيد الحالي</h3>
              <div className="bg-blue-200 rounded-full p-2">
                <TrendingUp className="h-4 w-4 text-blue-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-900">
              {formatCurrency(summary?.currentBalance || 0)}
            </div>
            <p className="text-xs text-blue-700 mt-2 font-medium">
              {(summary?.currentBalance || 0) > 0
                ? "🏪 مدين للصيدلية"
                : "💰 دائن للصيدلية"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border border-red-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-bold text-red-800">
                إجمالي المشتريات
              </h3>
              <div className="bg-red-200 rounded-full p-2">
                <ShoppingCart className="h-4 w-4 text-red-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-900">
              {formatCurrency(summary?.totalPurchases || 0)}
            </div>
            <p className="text-xs text-red-700 mt-2 font-medium">
              خلال الفترة المحددة
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-bold text-green-800">
                إجمالي المدفوعات
              </h3>
              <div className="bg-green-200 rounded-full p-2">
                <CreditCard className="h-4 w-4 text-green-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-900">
              {formatCurrency(summary?.totalPayments || 0)}
            </div>
            <p className="text-xs text-green-700 mt-2 font-medium">
              خلال الفترة المحددة
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg border border-purple-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-bold text-purple-800">
                عدد المعاملات
              </h3>
              <div className="bg-purple-200 rounded-full p-2">
                <FileText className="h-4 w-4 text-purple-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-900">
              {filteredData.length}
            </div>
            <p className="text-xs text-purple-700 mt-2 font-medium">
              معاملة نشطة
            </p>
          </div>
        </div>

        {/* Transaction Type Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            ملخص المعاملات حسب النوع
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { type: "PURCHASE", label: "شراء", color: "blue" },
              { type: "PAYMENT", label: "سداد", color: "green" },
              { type: "RETURN", label: "مرتجع", color: "orange" },
              { type: "WITHDRAWAL", label: "سحب", color: "purple" },
              { type: "OTHER", label: "أخرى", color: "gray" },
            ].map(({ type, label, color }) => {
              const count = transactions.filter((t) =>
                type === "OTHER"
                  ? !["PURCHASE", "PAYMENT", "RETURN", "WITHDRAWAL"].includes(
                      t.type,
                    )
                  : t.type === type,
              ).length;
              return (
                <div
                  key={type}
                  className={`bg-${color}-50 rounded-lg p-4 text-center border border-${color}-200 hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="flex justify-center mb-2">
                    {type === "OTHER" ? (
                      <FileText className="h-4 w-4 text-gray-600" />
                    ) : (
                      getTransactionIcon(type)
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {count}
                  </div>
                  <div className="text-xs text-gray-600">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Table with integrated filters */}
      <div className="mt-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <SupplierTransactionsTable
          data={filteredData}
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          sortBy={sortBy}
          searchQuery={searchQuery}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onTypeChange={setSelectedType}
          onStatusChange={setSelectedStatus}
          onSortChange={setSortBy}
          onSearchChange={setSearchQuery}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onReset={handleReset}
          allData={transactions}
        />
      </div>
    </div>
  );
}
