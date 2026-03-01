// @/features/sales/components/multi-invoice-sales.tsx
"use client";

import { useState, useEffect } from "react";
import { PlusIcon, ReceiptText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SaleForm from "../form/sale-form";

export default function MultiInvoiceSales({
  onActiveInvoiceChange,
  onInvoicesWithItemsChange,
  onInvoiceComplete,
}: {
  onActiveInvoiceChange?: (
    invoice: { id: number; name: string } | undefined,
  ) => void;
  onInvoicesWithItemsChange?: (invoiceIds: number[]) => void;
  onInvoiceComplete?: (invoiceId: number) => void;
}) {
  const [invoices, setInvoices] = useState([{ id: 1, name: "فاتورة 1" }]);
  const [activeInvoiceId, setActiveInvoiceId] = useState(1);
  const [invoicesWithItems, setInvoicesWithItems] = useState<number[]>([]);

  // Get current active invoice info
  const activeInvoice = invoices.find((inv) => inv.id === activeInvoiceId);

  // Notify parent when active invoice changes
  useEffect(() => {
    onActiveInvoiceChange?.(activeInvoice);
  }, [activeInvoice, onActiveInvoiceChange]);

  // Notify parent when invoices with items change
  useEffect(() => {
    onInvoicesWithItemsChange?.(invoicesWithItems);
  }, [invoicesWithItems, onInvoicesWithItemsChange]);

  const handleItemsChange = (invoiceId: number, hasItems: boolean) => {
    setInvoicesWithItems((prev) => {
      if (hasItems) {
        return prev.includes(invoiceId) ? prev : [...prev, invoiceId];
      } else {
        return prev.filter((id) => id !== invoiceId);
      }
    });
  };

  const handleInvoiceComplete = (invoiceId: number) => {
    // Remove the completed invoice from invoices with items
    setInvoicesWithItems((prev) => prev.filter((id) => id !== invoiceId));

    // Remove the invoice from the list
    const newInvoices = invoices.filter((inv) => inv.id !== invoiceId);

    // If the completed invoice was active, switch to another one
    if (activeInvoiceId === invoiceId && newInvoices.length > 0) {
      const currentIndex = invoices.findIndex((inv) => inv.id === invoiceId);
      if (currentIndex < newInvoices.length) {
        setActiveInvoiceId(newInvoices[currentIndex].id);
      } else {
        setActiveInvoiceId(newInvoices[newInvoices.length - 1].id);
      }
    }

    setInvoices(newInvoices);

    // Notify parent that invoice is complete
    onInvoiceComplete?.(invoiceId);
  };

  const handleDeleteInvoice = (invoiceId: number) => {
    if (invoices.length <= 1) return; // منع حذف آخر فاتورة

    const currentIndex = invoices.findIndex((inv) => inv.id === invoiceId);
    const newInvoices = invoices.filter((inv) => inv.id !== invoiceId);

    // لو تم حذف الفاتورة النشطة، اختار الفاتورة اللي جنبها
    if (activeInvoiceId === invoiceId && newInvoices.length > 0) {
      // لو فيه فاتورة بعد اللي تم حذفها، اختارها
      if (currentIndex < newInvoices.length) {
        setActiveInvoiceId(newInvoices[currentIndex].id);
      } else {
        // لو كانت آخر فاتورة، اختار اللي قبلها
        setActiveInvoiceId(newInvoices[newInvoices.length - 1].id);
      }
    }

    setInvoices(newInvoices);
  };

  return (
    // استخدمنا Flex عادي بدل ResizableGroup مؤقتاً للتأكد من أن المشكلة مش في الـ Panels نفسها
    <div className="flex h-full w-full overflow-hidden bg-slate-100">
      {/* Sidebar - عرض ثابت عشان ميبوظش الدنيا */}
      <aside className="w-64 border-l bg-slate-50 flex flex-col shrink-0 z-20 shadow-sm">
        <div className="p-4 border-b bg-white">
          <Button
            onClick={() => {
              const newId = Date.now();
              setInvoices([
                ...invoices,
                { id: newId, name: `فاتورة ${invoices.length + 1}` },
              ]);
              setActiveInvoiceId(newId);
            }}
            className="w-full gap-2"
          >
            <PlusIcon size={16} /> فاتورة جديدة
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex gap-1 group items-stretch">
              <Button
                variant={activeInvoiceId === inv.id ? "default" : "outline"}
                className={`flex-1 justify-start gap-3 h-9 ${
                  activeInvoiceId === inv.id
                    ? ""
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
                onClick={() => {
                  console.log("Switching to invoice:", inv.id);
                  setActiveInvoiceId(inv.id);
                }}
              >
                <ReceiptText size={18} />
                <span>{inv.name}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteInvoice(inv.id)}
                disabled={invoices.length <= 1}
                className="h-9 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent transition-all duration-200 px-2.5 py-1.5"
                title={
                  invoices.length <= 1
                    ? "لا يمكن حذف آخر فاتورة"
                    : "حذف الفاتورة"
                }
              >
                <Trash2 size={15} />
              </Button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative bg-white overflow-hidden flex flex-col">
        {/* الـ key هنا هو السر، لو مش موجود الـ SaleForm مش هيحس بتغيير الفاتورة */}
        <SaleForm
          key={activeInvoiceId}
          invoiceId={activeInvoiceId}
          onItemsChange={(hasItems) =>
            handleItemsChange(activeInvoiceId, hasItems)
          }
          onInvoiceComplete={() => handleInvoiceComplete(activeInvoiceId)}
        />
      </main>
    </div>
  );
}
