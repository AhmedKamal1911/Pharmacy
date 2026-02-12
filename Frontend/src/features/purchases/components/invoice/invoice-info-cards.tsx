import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, Package, Percent } from "lucide-react";
import type { PurchaseInvoice } from "../../types";

interface InvoiceInfoCardsProps {
  invoice: PurchaseInvoice;
}

export function InvoiceInfoCards({ invoice }: InvoiceInfoCardsProps) {
  return (
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
            <Badge variant="outline">شراء</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
