import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { PurchaseInvoice } from "../../types";

interface InvoiceNotesProps {
  invoice: PurchaseInvoice;
}

export function InvoiceNotes({ invoice }: InvoiceNotesProps) {
  if (!invoice.notes) return null;

  return (
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
        <p className="text-slate-700 leading-relaxed">
          {invoice.notes}
        </p>
      </CardContent>
    </Card>
  );
}
