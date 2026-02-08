import { useParams, useNavigate } from "react-router";
import {
  ArrowRight,
  FileText,
  DollarSign,
  Edit,
  Package,
  Percent,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPurchaseInvoiceById } from "@/features/purchases/api/mock-data";
import { PurchaseItemsTable } from "@/features/purchases/components/table/purchase-items-table";
import { createPurchaseItemColumns } from "@/features/purchases/components/table/purchase-item-columns";

export default function PurchaseInvoicePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();

  const invoice = invoiceId ? getPurchaseInvoiceById(invoiceId) : null;
  const columns = createPurchaseItemColumns();

  if (!invoice) {
    return (
      <div className="space-y-6">
        <PageHeader title="تفاصيل الفاتورة" />
        <div className="text-center py-12">
          <p className="text-muted-foreground">الفاتورة غير موجودة</p>
          <Button onClick={() => navigate("/purchases")} className="mt-4">
            العودة للمشتريات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center space-x-4 space-x-reverse">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  فاتورة رقم {invoice.invoiceNumber}
                </h1>
                <p className="text-slate-500">تفاصيل الفاتورة الكاملة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-slate-50"
              >
                <FileText size={18} />
                طباعة
              </Button>
              <Button
                onClick={() => navigate(`/purchases/edit/${invoiceId}`)}
                variant="outline"
                className="flex items-center gap-2 hover:bg-orange-50"
              >
                <Edit size={18} />
                تعديل
              </Button>
              <Button
                onClick={() => navigate("/purchases")}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <ArrowRight size={18} />
                العودة
              </Button>
            </div>
          </div>
        </div>

        {/* Invoice Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Invoice Info Card */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-slate-900">
                  بيانات الفاتورة
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">رقم الفاتورة</span>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {invoice.invoiceNumber}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">التاريخ</span>
                <span className="font-medium text-slate-900">
                  {new Date(invoice.invoiceDate).toLocaleDateString("en-US")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">المورد</span>
                <span className="font-medium text-slate-900">
                  {invoice.supplierName}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary Card */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <CardTitle className="text-lg text-slate-900">
                  المجموعات المالية
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">المجموع الكلي</span>
                <span className="font-bold text-lg text-green-600">
                  {invoice.totals.total.toLocaleString()} جنيه
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">قيمة الأصناف</span>
                <span className="font-medium text-slate-900">
                  {invoice.totals.itemsValue.toLocaleString()} جنيه
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">نسبة الربح</span>
                <div className="flex items-center gap-1">
                  <Percent className="h-3 w-3 text-green-600" />
                  <span className="font-medium text-green-600">
                    {invoice.totals.profitPercentage}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Package className="h-4 w-4 text-amber-600" />
                </div>
                <CardTitle className="text-lg text-slate-900">
                  معلومات الفاتورة
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">عدد الأصناف</span>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200"
                >
                  {invoice.items.length} أصناف
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">حالة الفاتورة</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  مدفوع
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">نوع الفاتورة</span>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  مشتريات
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Section */}
        {invoice.notes && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <CardTitle className="text-lg text-slate-900">
                  ملاحظات
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-slate-700">{invoice.notes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items Table */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Package className="h-4 w-4 text-indigo-600" />
              </div>
              <CardTitle className="text-lg text-slate-900">
                الأصناف ({invoice.items.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <PurchaseItemsTable columns={columns} data={invoice.items} />
            </div>
          </CardContent>
        </Card>

        {/* Totals Breakdown */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <CardTitle className="text-lg text-slate-900">
                تفصيل المجموعات
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">المجموع الأساسي</span>
                  <span className="font-medium text-slate-900">
                    {invoice.totals.baseTotal.toLocaleString()} جنيه
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">إجمالي الضريبة</span>
                  <span className="font-medium text-orange-600">
                    {invoice.totals.taxTotal.toLocaleString()} جنيه
                  </span>
                </div>
                {invoice.totals.extraCosts && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">تكاليف إضافية</span>
                    <span className="font-medium text-slate-900">
                      {invoice.totals.extraCosts.toLocaleString()} جنيه
                    </span>
                  </div>
                )}
                {invoice.totals.extraDiscount && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">خصم إضافي</span>
                    <span className="font-medium text-red-600">
                      -{invoice.totals.extraDiscount.toLocaleString()} جنيه
                    </span>
                  </div>
                )}
                <Separator className="bg-slate-300" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">
                    المجموع الكلي
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {invoice.totals.total.toLocaleString()} جنيه
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
