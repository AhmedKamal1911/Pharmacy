import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { InvoiceTotals } from "../../types";

interface PurchaseTotalsCardProps {
  totals: InvoiceTotals;
}

export function PurchaseTotalsCard({ totals }: PurchaseTotalsCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">
          المجموعات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">قيمة الأصناف</span>
            <span className="font-medium">
              {totals.itemsValue.toLocaleString()} جنيه
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">الضريبة</span>
            <span className="font-medium text-orange-600">
              {totals.taxTotal.toLocaleString()} جنيه
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-bold text-slate-900">
              المجموع الكلي
            </span>
            <span className="font-bold text-lg text-green-600">
              {totals.total.toLocaleString()} جنيه
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
