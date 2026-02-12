import { useParams, useNavigate } from "react-router";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPurchaseInvoiceById } from "@/features/purchases/api/mock-data";
import { PurchaseItemsTable } from "@/features/purchases/components/table/purchase-items-table";
import { createPurchaseItemColumns } from "@/features/purchases/components/table/purchase-item-columns";
import {
  InvoiceHeader,
  InvoiceInfoCards,
  InvoiceNotes,
  InvoiceTotals,
} from "@/features/purchases/components/invoice";

export default function PurchaseInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const invoice = id ? getPurchaseInvoiceById(id) : null;
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
        <InvoiceHeader
          invoice={invoice}
          onEdit={() => navigate(`/purchases/${id}/edit`)}
          onBack={() => navigate("/purchases")}
        />

        {/* Invoice Overview Cards */}
        <InvoiceInfoCards invoice={invoice} />

        {/* Notes Section */}
        <InvoiceNotes invoice={invoice} />

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
        <InvoiceTotals invoice={invoice} />
      </div>
    </div>
  );
}
