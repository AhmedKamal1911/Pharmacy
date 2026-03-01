import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MedicineSelector } from "@/features/medicines/components/medicine-selector";
import type { PurchaseItem } from "@/features/purchases/types";

interface AddItemDialogProps {
  onItemSelect: (newItem: PurchaseItem) => void;
}

export function AddItemDialog({ onItemSelect }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (
    medicineId: string,
    medicineName: string,
    medicineCode?: string,
  ) => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      medicineId,
      medicineCode: medicineCode || "",
      medicineName,
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
    onItemSelect(newItem);
    setOpen(false); // نقفل المودال بعد الاختيار
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} />
          إضافة صنف
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            إضافة صنف للفاتورة
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                اختر الصنف من القائمة
              </label>
              <p className="text-sm text-slate-500 mb-4">
                ابحث باسم الصنف أو الكود للوصول للمنتج بسرعة
              </p>
              <MedicineSelector
                value=""
                onValueChange={handleSelect}
                placeholder="ابحث باسم الصنف أو الكود..."
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
