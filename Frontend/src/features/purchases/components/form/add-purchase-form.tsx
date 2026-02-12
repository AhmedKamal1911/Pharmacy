import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddInvoiceForm } from "./purchase-invoice-form";
import { PurchaseItemsForm } from "./purchase-items-form";
import { PurchaseTotalsCard } from "../ui/purchase-totals-card";
import type { PurchaseInvoice, PurchaseItem, InvoiceTotals } from "../../types";

interface AddPurchaseFormProps {
  onSubmit: (data: PurchaseInvoice) => void;
  isLoading?: boolean;
  defaultSupplierId?: string;
}

export function AddPurchaseForm({
  onSubmit,
  isLoading = false,
  defaultSupplierId,
}: AddPurchaseFormProps) {
  // Form State
  const [invoiceData, setInvoiceData] = useState({
    supplierId: defaultSupplierId || "",
    notes: "",
  });

  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: "1",
      medicineId: "",
      medicineName: "",
      medicineCode: "",
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
    },
  ]);

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

    return {
      itemsValue,
      taxTotal,
      baseTotal,
      total: baseTotal,
      profitPercentage: 20,
      extraCosts: 0,
      extraDiscount: 0,
    };
  };

  const totals = calculateTotals();

  // Add New Item
  const addItem = () => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      medicineId: "",
      medicineName: "",
      medicineCode: "",
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

  // Handle Submit
  const handleSubmit = () => {
    const newInvoice: PurchaseInvoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      supplierId: invoiceData.supplierId,
      supplierName: "",
      // This would be populated from supplier data
      notes: invoiceData.notes,
      items: items,
      totals: totals,
    };

    onSubmit(newInvoice);
  };

  // Update Invoice Data
  const handleSupplierChange = (value: string) => {
    setInvoiceData({ ...invoiceData, supplierId: value });
  };

  const handleNotesChange = (value: string) => {
    setInvoiceData({ ...invoiceData, notes: value });
  };

  const isFormValid =
    invoiceData.supplierId &&
    items.every(
      (item) => item.medicineId && item.medicineName && item.salePrice > 0,
    );

  return (
    <div className="space-y-6">
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

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!isFormValid || isLoading}>
          {isLoading ? "جاري الحفظ..." : "حفظ الفاتورة"}
        </Button>
      </div>
    </div>
  );
}
