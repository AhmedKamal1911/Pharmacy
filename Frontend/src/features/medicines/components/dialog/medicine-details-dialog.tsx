import {
  Package,
  Calendar,
  Hash,
  DollarSign,
  Box,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Medicine } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MedicineDetailsDialogProps {
  medicine: Medicine | null;
  open: boolean;
  onClose: () => void;
}

export function MedicineDetailsDialog({
  medicine,
  open,
  onClose,
}: MedicineDetailsDialogProps) {
  if (!medicine) return null;

  const totalStock = medicine.variants.reduce(
    (sum, variant) => sum + variant.stock,
    0,
  );
  const isLowStock = totalStock <= (medicine.minStock || 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" dir="rtl">
        <DialogHeader className="pt-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6 text-blue-600" />
            تفاصيل الدواء
          </DialogTitle>
          <DialogDescription>
            معلومات كاملة عن الدواء والمتغيرات والدفاتر
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-6 pe-4 py-2">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-blue-500" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      اسم الدواء
                    </label>
                    <p className="text-lg font-semibold">{medicine.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      الكود
                    </label>
                    <p className="text-lg font-semibold">
                      {medicine.code || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      الفئة
                    </label>
                    <p className="text-lg font-semibold">{medicine.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      الوحدة
                    </label>
                    <p className="text-lg font-semibold">
                      {medicine.unit || "-"}
                    </p>
                  </div>
                </div>
                {medicine.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      الوصف
                    </label>
                    <p className="text-base mt-1">{medicine.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stock Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Box className="h-5 w-5 text-green-500" />
                  معلومات المخزون
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">إجمالي المخزون</p>
                    <p
                      className={`text-2xl font-bold ${isLowStock ? "text-red-600" : "text-green-600"}`}
                    >
                      {totalStock}
                    </p>
                    {isLowStock && (
                      <Badge variant="destructive" className="mt-2">
                        <AlertTriangle className="h-3 w-3 ml-1" />
                        مخزون منخفض
                      </Badge>
                    )}
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">الحد الأدنى</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {medicine.minStock || 0}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">عدد المتغيرات</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {medicine.variants.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                  معلومات الأسعار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">السعر الأساسي</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {medicine.basePrice
                        ? `${medicine.basePrice.toLocaleString("ar-EG")} ج.م`
                        : "-"}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">تكلفة الشراء</p>
                    <p className="text-2xl font-bold text-red-600">
                      {medicine.cost
                        ? `${medicine.cost.toLocaleString("ar-EG")} ج.م`
                        : "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variants and Batches Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hash className="h-5 w-5 text-purple-500" />
                  المتغيرات والدفاتر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicine.variants.map((variant, index) => (
                    <div
                      key={variant.id}
                      className="border rounded-xl p-5 bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex  items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <h4 className="font-semibold text-lg text-gray-800">
                            المتغير {index + 1}
                          </h4>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              variant.stock > 0 ? "default" : "destructive"
                            }
                            className="px-3 py-1"
                          >
                            {variant.stock > 0 ? (
                              <>
                                <Box className="h-3 w-3 ml-1" />
                                المخزون: {variant.stock}
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 ml-1" />
                                نفذ المخزون
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2  gap-3">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                رقم الدفعة
                              </label>
                              <p className="font-semibold text-gray-800">
                                {variant.batchNumber || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-blue-400" />
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                السعر
                              </label>
                              <p className="font-semibold text-blue-600">
                                {(variant.price || 0).toLocaleString("ar-EG")}{" "}
                                ج.م
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-red-400" />
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                التكلفة
                              </label>
                              <p className="font-semibold text-red-600">
                                {(variant.cost || 0).toLocaleString("ar-EG")}{" "}
                                ج.م
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <Box className="h-4 w-4 text-green-400" />
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                المخزون
                              </label>
                              <p className="font-semibold text-green-600">
                                {variant.stock}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-400" />
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                تاريخ الانتهاء
                              </label>
                              <p className="font-semibold text-orange-600">
                                {variant.expiryDate
                                  ? new Date(
                                      variant.expiryDate,
                                    ).toLocaleDateString("ar-EG")
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {medicine.variants.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <Hash className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-lg font-medium">
                        لا توجد متغيرات مسجلة
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        لم يتم إضافة أي متغيرات لهذا الدواء بعد
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-3">
          <Button onClick={onClose} className="px-6">
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
