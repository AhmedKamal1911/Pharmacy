import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign } from "lucide-react";
import type { PurchaseInvoice } from "../../types";

interface InvoiceTotalsProps {
  invoice: PurchaseInvoice;
}

export function InvoiceTotals({ invoice }: InvoiceTotalsProps) {
  return (
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
  );
}
