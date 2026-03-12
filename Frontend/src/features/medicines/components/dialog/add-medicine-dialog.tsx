import * as React from "react";
import { toast } from "sonner";
import { Package, X } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import type { Medicine, MedicineFormData } from "../../types";
import { medicinesApi } from "../../api";
import { AddMedicineForm } from "../form/add-medicine-form";

interface AddMedicineDialogProps {
  onMedicineAdded?: (medicine: Medicine) => void;
}

export function AddMedicineDialog({ onMedicineAdded }: AddMedicineDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: MedicineFormData) => {
    setIsLoading(true);

    try {
      const newMedicine = await medicinesApi.createMedicine({
        ...data,
        variants: data.variants.map((variant, index: number) => ({
          ...variant,
          id: `variant-${Date.now()}-${index}`,
        })),
      });

      if (onMedicineAdded) {
        onMedicineAdded(newMedicine);
      }

      toast.success("تم إضافة الدواء بنجاح!", {
        description: `تمت إضافة ${newMedicine.name} إلى النظام بنجاح.`,
      });

      setIsOpen(false);
    } catch {
      toast.error("فشل في إضافة الدواء", {
        description: "حدث خطأ أثناء إضافة الدواء. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Button to open dialog */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
      >
        <Package className="h-5 w-5" />
        إضافة دواء جديد
      </button>

      {/* Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-gray-50 rounded-2xl shadow-2xl w-[95vw] h-[90vh] md:w-[90vw] md:h-[85vh] lg:w-[85vw] lg:h-[85vh] max-w-7xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/10 hover:bg-white/20 hover:text-red-200 p-2 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-hidden bg-gray-50">
              <ScrollArea className="h-full w-full" dir="rtl">
                <div className="p-3.5 space-y-6">
                  {/* Form Container */}
                  <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-gray-50/80 px-3 py-3 border-b flex justify-between items-center">
                      <h3 className="font-bold text-gray-900 flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        بيانات الدواء
                      </h3>
                      <Badge className="font-bold bg-blue-50 border-blue-200 text-blue-700 px-4 py-1.5 text-sm">
                        نموذج إدخال
                      </Badge>
                    </div>

                    <div className="w-full overflow-x-auto">
                      <div className="p-2">
                        <AddMedicineForm
                          onSubmit={handleSubmit}
                          isLoading={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
