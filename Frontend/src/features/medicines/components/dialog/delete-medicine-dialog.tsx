import { useState } from "react";
import { AlertTriangle, Package, Trash2, Ban, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner"; // 👈 استيراد مكتبة الإشعارات sonner

import type { Medicine } from "../../types";

interface DeleteMedicineDialogProps {
  medicine: Medicine | null;
  open: boolean;
  onClose: () => void;
  onDelete: (medicineId: string, variantIds?: string[]) => void;
}

export function DeleteMedicineDialog({
  medicine,
  open,
  onClose,
  onDelete,
}: DeleteMedicineDialogProps) {
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [deleteMedicineFull, setDeleteMedicineFull] = useState(false);

  // Reset state when dialog closes
  const handleClose = () => {
    setSelectedVariants([]);
    setDeleteMedicineFull(false);
    onClose();
  };

  if (!medicine) return null;

  // تصنيف الباتشات
  const deletableVariants = medicine.variants.filter((v) => v.stock === 0);
  const variantsWithStock = medicine.variants.filter((v) => v.stock > 0);

  const handleVariantToggle = (variantId: string, checked: boolean) => {
    if (checked) {
      setSelectedVariants((prev) => [...prev, variantId]);
    } else {
      setSelectedVariants((prev) => prev.filter((id) => id !== variantId));
    }
    // إذا قام المستخدم بتعديل الباتشات، نلغي خيار "حذف الدواء بالكامل"
    setDeleteMedicineFull(false);
  };

  const handleDeleteMedicineToggle = (checked: boolean) => {
    setDeleteMedicineFull(checked);
    if (checked) {
      // إذا اختار حذف الدواء بالكامل، لا داعي لتحديد باتشات فردية
      setSelectedVariants([]);
    }
  };

  const handleConfirm = () => {
    try {
      if (deleteMedicineFull) {
        // إذا كان هناك مخزون في أي باتش، لا تسمح بحذف الدواء بالكامل
        if (variantsWithStock.length > 0) {
          toast.error("لا يمكن حذف الدواء بالكامل، يوجد مخزون في بعض الدفعات.");
          return;
        }
        onDelete(medicine.id);
        toast.success(`تم حذف الدواء "${medicine.name}" بنجاح.`);
      } else if (selectedVariants.length > 0) {
        onDelete(medicine.id, selectedVariants);
        toast.success(`تم حذف ${selectedVariants.length} دفعة بنجاح.`);
      }
      handleClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء عملية الحذف.");
    }
  };

  const canDelete = deleteMedicineFull || selectedVariants.length > 0;

  // إذا أراد المستخدم حذف الدواء بالكامل ولديه باتشات بها مخزون (غير مسموح)
  const isFullDeleteDisabled = variantsWithStock.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden gap-0 pt-4"
        dir="rtl"
      >
        {/* === Header === */}
        <DialogHeader className="p-6 pb-4 border-b bg-red-50/30 ">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-red-700">
            <Trash2 className="h-6 w-6" />
            إدارة حذف الدواء: {medicine.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            يمكنك حذف الدفعات (Batches) الفارغة فقط. لا يمكن حذف الدفعات التي
            تحتوي على مخزون.
          </DialogDescription>
        </DialogHeader>

        {/* === Scrollable Content === */}
        <ScrollArea className="max-h-[60vh] px-6 py-4">
          <div className="space-y-6 pb-4">
            {/* ملخص الحالة */}
            <div className="flex gap-4 mb-2">
              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                إجمالي الدفعات: {medicine.variants.length}
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                قابل للحذف: {deletableVariants.length}
              </Badge>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                يحتوي على مخزون: {variantsWithStock.length}
              </Badge>
            </div>

            {/* قسم الدفعات (Batches List) */}
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  قائمة الدفعات
                </span>
              </div>

              <div className="divide-y max-h-[300px] overflow-y-auto">
                {medicine.variants.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    لا توجد دفعات مسجلة لهذا الدواء.
                  </div>
                ) : (
                  medicine.variants.map((variant) => {
                    const hasStock = variant.stock > 0;
                    const isSelected = selectedVariants.includes(variant.id);

                    return (
                      <label
                        key={variant.id}
                        className={`flex items-start gap-3 p-4 transition-colors ${
                          hasStock
                            ? "bg-gray-50/50 cursor-not-allowed opacity-75" // تصميم الباتش الممتلئ
                            : "cursor-pointer hover:bg-red-50/50" // تصميم الباتش القابل للحذف
                        }`}
                      >
                        <div className="pt-0.5">
                          {hasStock ? (
                            <Ban className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked: boolean) =>
                                handleVariantToggle(variant.id, checked)
                              }
                              className="h-5 w-5 border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                            />
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-semibold ${
                                hasStock ? "text-gray-500" : "text-gray-900"
                              }`}
                            >
                              الدفعة:{" "}
                              <span dir="ltr">
                                {variant.batchNumber || "بدون رقم"}
                              </span>
                            </span>
                            <Badge
                              variant={hasStock ? "default" : "secondary"}
                              className={
                                hasStock
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-gray-100 text-gray-500"
                              }
                            >
                              المخزون: {variant.stock}
                            </Badge>
                          </div>

                          {variant.expiryDate && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="h-3.5 w-3.5" />
                              انتهاء:{" "}
                              {new Date(variant.expiryDate).toLocaleDateString(
                                "ar-EG",
                              )}
                            </div>
                          )}

                          {hasStock && (
                            <p className="text-xs text-amber-600 mt-1">
                              * لا يمكن الحذف. يجب تصفير المخزون أولاً.
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* خيار حذف الدواء بالكامل (Danger Zone) */}
            <div className="mt-6 pt-6 border-t border-dashed">
              <label
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  isFullDeleteDisabled
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    : deleteMedicineFull
                      ? "border-red-500 bg-red-50 cursor-pointer"
                      : "border-gray-200 bg-white hover:border-red-200 cursor-pointer"
                }`}
              >
                <Checkbox
                  checked={deleteMedicineFull}
                  onCheckedChange={handleDeleteMedicineToggle}
                  disabled={isFullDeleteDisabled}
                  className="h-5 w-5 border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-red-700 flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    حذف الدواء بالكامل (إجراء نهائي)
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    سيتم حذف بيانات الدواء الأساسية وجميع الدفعات المرتبطة به.
                  </p>
                </div>
              </label>

              {/* تنبيه إذا كان الدواء غير قابل للحذف كلياً */}
              {isFullDeleteDisabled && (
                <Alert className="mt-3 border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800 text-sm font-bold">
                    تعذر تحديد خيار الحذف الكلي
                  </AlertTitle>
                  <AlertDescription className="text-amber-700 text-xs mt-1">
                    يوجد دفعات تحتوي على مخزون. لا يمكنك حذف الدواء بالكامل حتى
                    يصبح إجمالي المخزون صفر.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* === Footer === */}
        <DialogFooter className="p-4 border-t bg-gray-50">
          <div className="flex justify-between w-full items-center">
            <div className="text-sm text-gray-500 font-medium px-2">
              {selectedVariants.length > 0 && !deleteMedicineFull && (
                <span>تم تحديد {selectedVariants.length} دفعة للحذف</span>
              )}
              {deleteMedicineFull && (
                <span className="text-red-600">سيتم حذف الدواء بالكامل</span>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-4 py-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={!canDelete}
                className={`px-4 py-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                  canDelete
                    ? "bg-red-700! hover:bg-red-600! hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gray-300 hover:bg-gray-300 cursor-not-allowed opacity-60"
                }`}
              >
                {deleteMedicineFull ? "تأكيد الحذف الكلي" : "حذف المحدد"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
