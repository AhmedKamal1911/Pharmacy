import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  ReceiptText,
  AlertTriangle,
  User,
  Building2,
  CalendarDays,
  Clock,
  UserCircle2,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Package,
  FileBox,
} from "lucide-react";
import type { ReturnInvoice } from "../../types";

// مكونات صغيرة للحالة
const StatusBadge = ({ status }: { status: string }) => {
  if (status === "completed")
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0 shadow-none">
        مكتملة
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 shadow-none">
        معلقة
      </Badge>
    );
  return (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0 shadow-none">
      ملغية
    </Badge>
  );
};

const TypeBadge = ({ type }: { type: string }) => {
  const isSales = type === "sales_return";
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 px-2.5 py-1 border shadow-none ${
        isSales
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-teal-50 text-teal-700 border-teal-200"
      }`}
    >
      {isSales ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
      {isSales ? "مرتجع مبيعات" : "مرتجع مشتريات"}
    </Badge>
  );
};

interface ViewReturnDialogProps {
  returnInvoice: ReturnInvoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewReturnDialog({
  returnInvoice,
  open,
  onOpenChange,
}: ViewReturnDialogProps) {
  const isSales = returnInvoice.type === "sales_return";

  // إعداد الألوان المتغيرة حسب نوع المرتجع (للحفاظ على نظافة الكود تحت)
  const theme = {
    lightBg: isSales ? "bg-blue-50/50" : "bg-teal-50/50",
    iconBg: isSales ? "bg-blue-100 text-blue-600" : "bg-teal-100 text-teal-600",
    iconText: isSales ? "text-blue-600" : "text-teal-600",
    borderBase: isSales ? "border-blue-100" : "border-teal-100",
    textHeading: isSales ? "text-blue-900" : "text-teal-900",
    textHighlight: isSales ? "text-blue-700" : "text-teal-700",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl p-0 bg-white border-0 shadow-2xl rounded-2xl overflow-hidden"
        dir="rtl"
      >
        {/* Header - Dynamic Theme */}
        <DialogHeader
          className={`px-8 py-6 border-b ${theme.borderBase} ${theme.lightBg}`}
        >
          <DialogTitle className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border ${theme.borderBase} ${theme.iconBg}`}
              >
                <ReceiptText className="h-7 w-7" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h2
                  className={`text-2xl font-bold tracking-tight ${theme.textHeading}`}
                >
                  مرتجع #{returnInvoice.invoiceNumber}
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-normal">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(returnInvoice.date).toLocaleDateString("ar-EG")}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2.5">
              <div className="flex gap-2">
                <TypeBadge type={returnInvoice.type} />
                <StatusBadge status={returnInvoice.status} />
              </div>
              <div className={`text-2xl font-black ${theme.textHeading}`}>
                {returnInvoice.totalAmount.toLocaleString("ar-EG")}{" "}
                <span className="text-sm font-medium text-slate-500">ج.م</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Content Area */}
        <ScrollArea className="max-h-[75vh]">
          <div className="p-8 space-y-8">
            {/* Reason Alert */}
            {returnInvoice.reason && (
              <div className="bg-red-50 border border-red-100 text-red-800 px-4 py-3.5 rounded-xl flex items-start gap-3 shadow-sm">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold mb-1">سبب المرتجع</h4>
                  <p className="text-sm text-red-600/90 leading-relaxed">
                    {returnInvoice.reason}
                  </p>
                </div>
              </div>
            )}

            {/* Meta Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Section 1: Invoice Details */}
              <div>
                <h3
                  className={`text-sm font-bold uppercase tracking-wider border-b pb-2.5 mb-5 flex items-center gap-2 ${theme.borderBase} ${theme.textHeading}`}
                >
                  <FileBox className={`h-4 w-4 ${theme.iconText}`} />
                  بيانات الفاتورة الأصلية
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 flex items-center gap-2.5">
                      <ReceiptText className="h-4 w-4 text-slate-400" />{" "}
                      الفاتورة الأصلية
                    </span>
                    <span
                      className={`text-sm font-bold px-2.5 py-1 rounded-md ${theme.lightBg} ${theme.textHighlight}`}
                    >
                      {returnInvoice.originalInvoiceNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 flex items-center gap-2.5">
                      <UserCircle2 className="h-4 w-4 text-slate-400" /> الصيدلي
                      المسؤول
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {returnInvoice.createdBy}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-slate-400" /> وقت وتاريخ
                      المرتجع
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {new Date(returnInvoice.date).toLocaleTimeString(
                        "ar-EG",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Entity Details */}
              <div>
                <h3
                  className={`text-sm font-bold uppercase tracking-wider border-b pb-2.5 mb-5 flex items-center gap-2 ${theme.borderBase} ${theme.textHeading}`}
                >
                  {isSales ? (
                    <User className={`h-4 w-4 ${theme.iconText}`} />
                  ) : (
                    <Building2 className={`h-4 w-4 ${theme.iconText}`} />
                  )}
                  {isSales ? "معلومات العميل" : "معلومات المورد"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 flex items-center gap-2.5">
                      {isSales ? (
                        <User className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Building2 className="h-4 w-4 text-slate-400" />
                      )}
                      الاسم
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {returnInvoice.entityName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 flex items-center gap-2.5">
                      <CreditCard className="h-4 w-4 text-slate-400" /> طريقة
                      الاسترداد
                    </span>
                    <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                      {returnInvoice.paymentMethod === "cash"
                        ? "نقدي"
                        : returnInvoice.paymentMethod === "visa"
                          ? "فيزا"
                          : "آجل"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="pt-2">
              <h3
                className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${theme.textHeading}`}
              >
                <Package className={`h-4 w-4 ${theme.iconText}`} />
                الأصناف المرتجعة
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-right">
                  <thead
                    className={`${theme.lightBg} border-b border-slate-200`}
                  >
                    <tr>
                      <th className="px-5 py-3.5 font-bold text-slate-700">
                        كود
                      </th>
                      <th className="px-5 py-3.5 font-bold text-slate-700">
                        اسم الصنف
                      </th>
                      <th className="px-5 py-3.5 font-bold text-slate-700 text-center">
                        الكمية
                      </th>
                      <th className="px-5 py-3.5 font-bold text-slate-700">
                        سعر الوحدة
                      </th>
                      <th className="px-5 py-3.5 font-bold text-slate-700">
                        الخصم
                      </th>
                      <th className="px-5 py-3.5 font-bold text-slate-900 text-left">
                        الإجمالي
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {/* Dummy Data - Replace with map */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">
                        001
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        بانادول أدفانس 500 مجم
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-1 font-bold rounded-md ${theme.lightBg} ${theme.textHighlight}`}
                        >
                          2
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">
                        15.00 ج.م
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">
                        0.00 ج.م
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900 text-left">
                        30.00 ج.م
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">
                        002
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        أوجمنتين 1 جرام
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-1 font-bold rounded-md ${theme.lightBg} ${theme.textHighlight}`}
                        >
                          1
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">
                        89.00 ج.م
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">
                        0.00 ج.م
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900 text-left">
                        89.00 ج.م
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-4 text-left text-sm font-bold text-slate-600"
                      >
                        إجمالي الفاتورة:
                      </td>
                      <td
                        className={`px-5 py-4 text-left text-xl font-black ${theme.textHighlight}`}
                      >
                        {returnInvoice.totalAmount.toLocaleString("ar-EG")} ج.م
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
