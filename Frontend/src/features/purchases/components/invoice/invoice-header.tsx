import { Button } from "@/components/ui/button";
import { FileText, Edit, ArrowRight } from "lucide-react";
import type { PurchaseInvoice } from "../../types";

interface InvoiceHeaderProps {
  invoice: PurchaseInvoice;
  onPrint?: () => void;
  onEdit?: () => void;
  onBack?: () => void;
}

export function InvoiceHeader({ 
  invoice, 
  onPrint, 
  onEdit, 
  onBack 
}: InvoiceHeaderProps) {
  return (
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
            onClick={onPrint}
            variant="outline"
            className="flex items-center gap-2 hover:bg-slate-50"
          >
            <FileText size={18} />
            طباعة
          </Button>
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex items-center gap-2 hover:bg-orange-50"
          >
            <Edit size={18} />
            تعديل
          </Button>
          <Button
            onClick={onBack}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <ArrowRight size={18} />
            العودة
          </Button>
        </div>
      </div>
    </div>
  );
}
