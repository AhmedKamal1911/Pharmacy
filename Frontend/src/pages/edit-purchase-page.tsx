import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PurchaseItemsForm } from "@/features/purchases/components/form/purchase-items-form";
import { PurchaseTotalsCard } from "@/features/purchases/components/ui/purchase-totals-card";
import { mockSuppliers } from "@/features/suppliers/api/mock-data";
import { getPurchaseInvoiceById } from "@/features/purchases/api/mock-data";
import type {
  PurchaseInvoice,
  PurchaseItem,
  InvoiceTotals,
} from "@/features/purchases/types";
import { unstable_batchedUpdates } from "react-dom";
import { AddInvoiceForm } from "@/features/purchases/components/form/purchase-invoice-form";

export default function EditPurchasePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();

  // Invoice State
  const [invoice, setInvoice] = useState<PurchaseInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [invoiceData, setInvoiceData] = useState({
    supplierId: "",
    notes: "",
  });

  const [items, setItems] = useState<PurchaseItem[]>([]);

  // Load Invoice Data
  useEffect(() => {
    if (invoiceId) {
      const invoiceData = getPurchaseInvoiceById(invoiceId);
      if (invoiceData) {
        // Batch all state updates to prevent cascading renders
        unstable_batchedUpdates(() => {
          setInvoice(invoiceData);
          setInvoiceData({
            supplierId: invoiceData.supplierId,
            notes: invoiceData.notes || "",
          });
          setItems([...invoiceData.items]);
          setIsLoading(false);
        });
      } else {
        unstable_batchedUpdates(() => {
          setIsLoading(false);
        });
      }
    }
  }, [invoiceId]);

  // Calculate Totals
  const calculateTotals = (): InvoiceTotals => {
    const itemsValue = items.reduce(
      (sum, item) => sum + item.salePrice * item.quantity,
      0,
    );
    const taxTotal = items.reduce(
      (sum, item) => sum + (item.cost * item.quantity * item.tax) / 100,
      0,
    );
    const baseTotal = itemsValue + taxTotal;
    const profitPercentage =
      itemsValue > 0
        ? ((itemsValue -
            items.reduce((sum, item) => sum + item.cost * item.quantity, 0)) /
            itemsValue) *
          100
        : 0;

    return {
      itemsValue,
      taxTotal,
      baseTotal,
      total: baseTotal,
      profitPercentage: profitPercentage || 20,
      extraCosts: 0,
      extraDiscount: 0,
    };
  };

  const totals = calculateTotals();

  // Add New Item
  const addItem = () => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      medicineCode: "",
      medicineName: "",
      quantity: 1,
      unitsPerPackage: 1,
      salePrice: 0,
      tax: 14,
      mainDiscount: 0,
      extraDiscount: 0,
      cost: 0,
      expiryDate: "",
      expirable: false,
      bonus: 0,
    };
    setItems([...items, newItem]);
  };

  // Update Item
  const updateItem = (
    id: string,
    field: keyof PurchaseItem,
    value: string | number | boolean,
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  // Remove Item
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Update Invoice
  const updateInvoice = () => {
    const supplier = mockSuppliers.find((s) => s.id === invoiceData.supplierId);
    if (!supplier || !invoice) return;

    const updatedInvoice: PurchaseInvoice = {
      ...invoice,
      supplierId: invoiceData.supplierId,
      supplierName: supplier.name,
      notes: invoiceData.notes,
      items: items,
      totals: totals,
    };

    // Here you would normally update via API
    console.log("Updated Invoice:", updatedInvoice);

    // Navigate to invoice detail
    navigate(`/purchases/invoice/${invoice.id}`);
  };

  // Update Invoice Data
  const handleSupplierChange = (value: string) => {
    setInvoiceData({ ...invoiceData, supplierId: value });
  };

  const handleNotesChange = (value: string) => {
    setInvoiceData({ ...invoiceData, notes: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-slate-500">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-slate-500">الفاتورة غير موجودة</p>
            <Button onClick={() => navigate("/purchases")} className="mt-4">
              العودة للمشتريات
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-3 rounded-xl">
                <Save className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  تعديل فاتورة {invoice.invoiceNumber}
                </h1>
                <p className="text-slate-500">تعديل بيانات الفاتورة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/purchases/invoice/${invoice.id}`)}
                className="flex items-center gap-2"
              >
                <X size={18} />
                إلغاء
              </Button>
              <Button
                onClick={updateInvoice}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                disabled={
                  !invoiceData.supplierId ||
                  items.some(
                    (item) => !item.medicineName || item.salePrice <= 0,
                  )
                }
              >
                <Save size={18} />
                حفظ التعديلات
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Invoice Info & Totals */}
          <div className="lg:col-span-1 space-y-6">
            <AddInvoiceForm
              supplierId={invoiceData.supplierId}
              notes={invoiceData.notes}
              onSupplierChange={handleSupplierChange}
              onNotesChange={handleNotesChange}
            />

            <PurchaseTotalsCard totals={totals} />
          </div>

          {/* Right Column - Items */}
          <div className="lg:col-span-2">
            <PurchaseItemsForm
              items={items}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
