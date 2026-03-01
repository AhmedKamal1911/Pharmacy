import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ReturnsTableWithFilters } from "../features/returns/components/table/returns-table-with-filters";
import { createColumns } from "../features/returns/components/table/columns";
import type {
  ReturnInvoice,
  ReturnType,
  ReturnStatus,
} from "../features/returns/types";
import { ViewReturnDialog } from "@/features/returns";
import { useReturns } from "../features/returns/hooks/use-returns";
import {
  X,
  ArrowLeftRight,
  TrendingDown,
  PackageMinus,
  Wallet,
} from "lucide-react";

export function ReturnsPage() {
  const { returns, isLoading, error } = useReturns();
  const [selectedReturn, setSelectedReturn] = useState<ReturnInvoice | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ReturnType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const handleViewReturn = (returnInvoice: ReturnInvoice) => {
    setSelectedReturn(returnInvoice);
  };

  const filteredReturns = useMemo(() => {
    let filtered = returns;

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.originalInvoiceNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          r.entityName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((r) => {
        const returnDate = new Date(r.date);

        switch (dateFilter) {
          case "today":
            return returnDate >= today;
          case "week": {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return returnDate >= weekAgo;
          }
          case "month": {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return returnDate >= monthAgo;
          }
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [returns, searchQuery, typeFilter, statusFilter, dateFilter]);

  const totalSalesReturns = filteredReturns.filter(
    (r) => r.type === "sales_return",
  ).length;
  const totalPurchaseReturns = filteredReturns.filter(
    (r) => r.type === "purchases_return",
  ).length;
  const totalAmount = filteredReturns.reduce(
    (sum, r) => sum + r.totalAmount,
    0,
  );

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setDateFilter("all");
  };

  const columns = createColumns(handleViewReturn);

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <div className="bg-red-100 rounded-full p-2">
            <X className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-800">حدث خطأ</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-10">
        <PageHeader
          title="إدارة المرتجعات"
          description="متابعة وتسجيل مرتجعات المبيعات والمشتريات الخاصة بالصيدلية"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    إجمالي المرتجعات
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {filteredReturns.length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <ArrowLeftRight className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    مرتجعات مبيعات
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalSalesReturns}
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    مرتجعات مشتريات
                  </p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {totalPurchaseReturns}
                  </p>
                </div>
                <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <PackageMinus className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    إجمالي القيم
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalAmount.toLocaleString("ar-EG")}
                  </p>
                </div>
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Table with integrated filters - matching stock page structure */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <ReturnsTableWithFilters
          data={filteredReturns}
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          onSearchChange={setSearchQuery}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          onDateChange={setDateFilter}
          onReset={clearFilters}
          allData={returns}
          isLoading={isLoading}
          columns={columns}
        />
      </div>

      {/* Modal */}
      {selectedReturn && (
        <ViewReturnDialog
          returnInvoice={selectedReturn}
          open={!!selectedReturn}
          onOpenChange={(open) => !open && setSelectedReturn(null)}
        />
      )}
    </div>
  );
}
