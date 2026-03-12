import { useState } from "react";
import { Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditMedicineForm } from "../form/edit-medicine-form";
import type { Medicine } from "../../types";
import { toast } from "sonner";

interface EditMedicineDialogProps {
  medicine: Medicine | null;
  open: boolean;
  onClose: () => void;
  onSave: (medicine: Medicine) => void;
}

export function EditMedicineDialog({
  medicine,
  open,
  onClose,
  onSave,
}: EditMedicineDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (data: {
    name: string;
    code?: string;
    category: string;
    description?: string;
    minStock: number;
    basePriceBatchIndex: number;
    variants: Array<{
      batchNumber: string;
      expiryDate?: string;
      price: number;
      cost: number;
      stock: number;
    }>;
  }) => {
    if (!medicine) return;

    setIsLoading(true);
    try {
      const basePrice = data.variants[data.basePriceBatchIndex]?.price || 0;
      const medicineData: Medicine = {
        ...medicine,
        name: data.name,
        code: data.code,
        category: data.category,
        description: data.description,
        minStock: data.minStock,
        basePrice,
        variants: data.variants.map((variant, index) => ({
          ...variant,
          id: medicine.variants[index]?.id || `variant-${Date.now()}-${index}`,
        })),
      };

      onSave(medicineData);
      toast.success("تم تحديث بيانات الدواء بنجاح");
      onClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث بيانات الدواء");
      console.error("Error updating medicine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!medicine) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" dir="rtl">
        <DialogHeader className="pt-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6 text-blue-600" />
            تعديل بيانات الدواء
          </DialogTitle>
          <DialogDescription>
            تعديل المعلومات الأساسية للدواء والدفاتر المرتبطة به
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-6 pe-4 py-2">
            <EditMedicineForm
              onSubmit={handleSave}
              onCancel={onClose}
              initialData={{
                name: medicine.name,
                code: medicine.code || "",
                category: medicine.category,
                description: medicine.description || "",
                minStock: medicine.minStock || 0,
                basePriceBatchIndex: 0,
                variants: medicine.variants.map((variant) => ({
                  batchNumber: variant.batchNumber || "",
                  expiryDate: variant.expiryDate || "",
                  price: variant.price,
                  cost: 0, // Default cost, should be stored in actual variant
                  stock: variant.stock,
                })),
              }}
              isLoading={isLoading}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
