"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { forwardRef, useImperativeHandle } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { type Medicine } from "@/data/medicines";
import SalesTable from "../table/sales-table";
import { QuickMedicineSearch } from "../ui/quick-medicine-search";

// 1. تحديد شكل البيانات (Validation Schema)
const saleFormSchema = z.object({
  customerName: z.string().min(2, "اسم العميل مطلوب"),
  items: z
    .array(
      z.object({
        medicineId: z.string().min(1, "اختر الدواء"),
        medicineName: z.string().optional(),
        quantity: z.number().min(1, "الكمية 1 على الأقل"),
        unitType: z.string().optional(),
        price: z.number().min(0.1, "السعر مطلوب"),
        discount: z.number().optional(),
        expiryDate: z.string().optional(),
        vat: z.number().optional(),
      }),
    )
    .min(1, "يجب إضافة صنف واحد على الأقل"),
});

export type SaleFormValues = z.infer<typeof saleFormSchema>;

const SaleForm = forwardRef<
  {
    addMedicine: (medicine: Medicine) => void;
  },
  {
    invoiceId: number;
    onItemsChange?: (hasItems: boolean) => void;
    onInvoiceComplete?: (invoiceId: number) => void;
  }
>(({ invoiceId, onItemsChange, onInvoiceComplete }, ref) => {
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // 2. تهيئة الفورم
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      customerName: "عميل نقدي",
      items: [
        {
          medicineId: "",
          medicineName: "",
          quantity: 1,
          unitType: "piece",
          price: 0,
          discount: 0,
          expiryDate: "",
          vat: 0,
        },
      ],
    },
  });

  // 3. التحكم في مصفوفة الأصناف (Dynamic Fields)
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  // Watch items array for changes
  const items = form.watch("items");

  // Notify parent when items change
  useEffect(() => {
    const hasItems = items.some(
      (item) => item.medicineId && item.medicineId.trim() !== "",
    );
    onItemsChange?.(hasItems);
  }, [items, onItemsChange]);

  // Handle quick medicine selection
  const handleQuickMedicineSelect = (medicine: Medicine) => {
    // Check if medicine already exists in the form
    const existingItemIndex = items.findIndex(
      (item) => item.medicineId === medicine.id,
    );

    if (existingItemIndex !== -1) {
      // Medicine exists, increase quantity
      const currentQuantity = items[existingItemIndex].quantity || 1;
      form.setValue(`items.${existingItemIndex}.quantity`, currentQuantity + 1);
    } else {
      // Medicine doesn't exist, add new item
      append({
        medicineId: medicine.id,
        medicineName: medicine.name,
        quantity: 1,
        unitType: "piece",
        price: medicine.price,
        discount: 0,
        expiryDate: medicine.expiryDate || "",
        vat: 0,
      });
    }
  };

  // Expose addMedicine method to parent
  useImperativeHandle(ref, () => ({
    addMedicine: (medicine: Medicine) => {
      // Check if medicine already exists in the form
      const existingItemIndex = items.findIndex(
        (item) => item.medicineId === medicine.id,
      );

      if (existingItemIndex !== -1) {
        // Medicine exists, increase quantity
        const currentQuantity = items[existingItemIndex].quantity || 1;
        form.setValue(
          `items.${existingItemIndex}.quantity`,
          currentQuantity + 1,
        );
      } else {
        // Medicine doesn't exist, add new item
        append({
          medicineId: medicine.id,
          medicineName: medicine.name,
          quantity: 1,
          unitType: "piece",
          price: medicine.price,
          discount: 0,
          expiryDate: medicine.expiryDate || "",
          vat: 0,
        });
      }
    },
  }));

  function onSubmit(data: SaleFormValues) {
    console.log("Invoice Data:", { invoiceId, ...data });
    // هنا يتم استدعاء الـ API الخاص بك لحفظ الفاتورة
  }

  // حساب المجموع الكلي تلقائياً
  const total = items.reduce((acc, item) => {
    const qty = item.quantity || 0;
    const prc = item.price || 0;
    const dsc = item.discount || 0;
    const vat = item.vat || 0;

    const lineTotal = qty * prc - (qty * prc * dsc) / 100 + vat;
    return acc + lineTotal;
  }, 0);

  const remainingAmount = total - paidAmount;

  const handlePaymentConfirmation = () => {
    if (paidAmount >= total) {
      console.log("Invoice Data:", {
        invoiceId,
        ...form.getValues(),
        paidAmount,
        remainingAmount,
      });
      // هنا يتم استدعاء الـ API الخاص بك لحفظ الفاتورة
      onInvoiceComplete?.(invoiceId);
      // Reset payment amount for next invoice
      setPaidAmount(0);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <FieldGroup className="flex-1 max-w-md">
                <FieldLabel
                  htmlFor="customerName"
                  className="text-sm font-semibold text-slate-700"
                >
                  اسم العميل
                </FieldLabel>
                <Input
                  id="customerName"
                  placeholder="اسم العميل..."
                  {...form.register("customerName")}
                  className="h-11 text-base border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {form.formState.errors.customerName && (
                  <FieldError className="mt-1">
                    {form.formState.errors.customerName.message}
                  </FieldError>
                )}
              </FieldGroup>

              <div className="text-right mr-6">
                <p className="text-sm text-slate-500 font-medium">
                  رقم الفاتورة:{" "}
                  <span className="text-primary font-bold">#{invoiceId}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calculator size={20} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">
                    {total.toFixed(2)} ج.م
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1  overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <SalesTable fields={fields} form={form} remove={remove} />

              <div className="p-4 mt-2 border-t border-slate-300 bg-gradient-to-r from-slate-50 to-slate-100 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="gap-2 h-11 px-6 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-200"
                  onClick={() =>
                    append({
                      medicineId: "",
                      medicineName: "",
                      quantity: 1,
                      unitType: "piece",
                      price: 0,
                      discount: 0,
                      expiryDate: "",
                      vat: 0,
                    })
                  }
                >
                  <Plus size={18} className="text-primary" />
                  <span className="font-medium">إضافة صنف جديد</span>
                </Button>

                <QuickMedicineSearch
                  onMedicineSelect={handleQuickMedicineSelect}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="p-6 bg-white border-t border-slate-200 shadow-lg">
          <div className="space-y-4">
            {/* Payment Summary */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-500 mb-1">الإجمالي</p>
                  <p className="text-lg font-bold text-slate-900">
                    {total.toFixed(2)} ج.م
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">المدفوع</p>
                  <p className="text-lg font-bold text-green-600">
                    {paidAmount.toFixed(2)} ج.م
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">الباقي</p>
                  <p
                    className={`text-lg font-bold ${remainingAmount > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {Math.abs(remainingAmount).toFixed(2)} ج.م
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Input */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <FieldGroup>
                  <FieldLabel
                    htmlFor="paidAmount"
                    className="text-sm font-semibold text-slate-700"
                  >
                    المبلغ المدفوع
                  </FieldLabel>
                  <Input
                    id="paidAmount"
                    type="number"
                    placeholder="أدخل المبلغ المدفوع..."
                    value={paidAmount || ""}
                    onChange={(e) =>
                      setPaidAmount(parseFloat(e.target.value) || 0)
                    }
                    className="h-11 text-base border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </FieldGroup>
              </div>
              <Button
                type="button"
                onClick={handlePaymentConfirmation}
                disabled={paidAmount < total || total === 0}
                className="px-8 h-11 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-slate-500 disabled:to-slate-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <Calculator size={20} />
                  <span>تأكيد الدفع</span>
                </div>
              </Button>
            </div>

            {/* Change Amount */}
            {remainingAmount < 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-green-800 font-semibold">
                  الباقي للعميل: {Math.abs(remainingAmount).toFixed(2)} ج.م
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
});

SaleForm.displayName = "SaleForm";

export default SaleForm;
