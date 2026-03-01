"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";
import MultiInvoiceSales from "../ui/multi-invoice-sales";
import { Button } from "@/components/ui/button";

export function SalesDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeInvoice, setActiveInvoice] = useState<
    { id: number; name: string } | undefined
  >();
  const [invoicesWithItems, setInvoicesWithItems] = useState<number[]>([]);

  const handleCloseAttempt = useCallback(() => {
    if (invoicesWithItems.length > 0) {
      const invoiceNumbers = invoicesWithItems.map((id) => `#${id}`).join(", ");
      toast.error(
        `لا يمكن إغلاق الكاشير - يجب إتمام الفواتير: ${invoiceNumbers}`,
        {
          duration: 6000,
          position: "bottom-right",
        },
      );
      return;
    }
    onClose();
  }, [invoicesWithItems, onClose]);

  // Auto-close dialog when invoice is complete and no other invoices have items
  const handleInvoiceComplete = useCallback(
    (invoiceId: number) => {
      // Remove the completed invoice from invoices with items
      const updatedInvoicesWithItems = invoicesWithItems.filter(
        (id) => id !== invoiceId,
      );

      // If no other invoices have items, close the dialog
      if (updatedInvoicesWithItems.length === 0) {
        setTimeout(() => {
          onClose();
        }, 1500); // Small delay to show completion message
      }
    },
    [invoicesWithItems, onClose],
  );

  // إغلاق عند الضغط على Esc
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log("Esc pressed"); // للتأكد في الـ Console
        handleCloseAttempt();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // منع السكرول في الخلفية لما الدايلوج يفتح
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, handleCloseAttempt]);

  if (!isOpen) return null;

  return (
    // z-[9999] عشان نضمن إنه فوق أي حاجة تانية
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - الضغط عليه يقفل برضه لو حبيت */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-inner"
        onClick={handleCloseAttempt}
      />

      {/* الجسم الرئيسي */}
      <div className="relative bg-white w-[98vw] h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        <header className="py-3 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary text-blue-600">
              <ShoppingCart size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                كاشير المبيعات
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Ultra Pharma System
                </p>
                {activeInvoice && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg shadow-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-[12px] font-semibold">
                      {activeInvoice.name}
                    </span>
                    <span className="text-[11px] font-bold bg-white/20 px-1.5 py-0.5 rounded">
                      #{activeInvoice.id}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-[11px] font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              اختصار الإغلاق{" "}
              <kbd className="font-sans font-bold text-slate-600">ESC</kbd>
            </div>

            {/* الزرار ده لازم يشتغل 100% */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation(); // منع انتشار الضغطة للخلفية
                handleCloseAttempt();
              }}
              className="rounded-full hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
            >
              <X size={24} />
            </Button>
          </div>
        </header>

        <div className="flex-1 min-h-0 bg-slate-50 overflow-hidden">
          <MultiInvoiceSales
            onActiveInvoiceChange={setActiveInvoice}
            onInvoicesWithItemsChange={setInvoicesWithItems}
            onInvoiceComplete={handleInvoiceComplete}
          />
        </div>
      </div>
    </div>
  );
}
