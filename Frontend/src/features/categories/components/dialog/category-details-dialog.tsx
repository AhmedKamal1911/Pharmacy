import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Box, AlertTriangle, Activity, X, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category } from "../../types";
import { medicines } from "@/data/medicines";

interface CategoryDetailsDialogProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryDetailsDialog({
  category,
  isOpen,
  onClose,
}: CategoryDetailsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const categoryMedicines = useMemo(() => {
    return medicines.filter(
      (medicine) => medicine.category === category.categoryName,
    );
  }, [category.categoryName]);

  const filteredMedicines = useMemo(() => {
    if (!searchQuery.trim()) return categoryMedicines;

    const query = searchQuery.toLowerCase();
    return categoryMedicines.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(query) ||
        medicine.code?.toLowerCase().includes(query) ||
        medicine.description?.toLowerCase().includes(query),
    );
  }, [categoryMedicines, searchQuery]);

  const totalStock = filteredMedicines.reduce(
    (sum, medicine) =>
      sum +
      medicine.variants.reduce(
        (variantSum, variant) => variantSum + variant.stock,
        0,
      ),
    0,
  );

  const lowStockItems = filteredMedicines.filter((medicine) =>
    medicine.variants.some(
      (variant) => medicine.minStock && variant.stock < medicine.minStock,
    ),
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2"
      onClick={onClose}
    >
      <div
        className="bg-gray-50 rounded-2xl shadow-2xl w-[95vw] h-[90vh] md:w-[90vw] md:h-[85vh] lg:w-[85vw] lg:h-[85vh] max-w-7xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">تفاصيل الفئة</h2>
              <p className="text-blue-100 text-sm font-mono tracking-wider">
                {category.categoryId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 hover:text-red-200 p-2 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-hidden bg-gray-50">
          <ScrollArea className="h-full w-full" dir="rtl">
            <div className="p-4 md:p-6 space-y-6">
              {/* Category Info & Stats - Cleaned up and consolidated */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Name Card */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 shrink-0">
                    <Tag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      اسم الفئة
                    </p>
                    <p className="font-bold text-gray-900 text-lg truncate">
                      {category.categoryName}
                    </p>
                  </div>
                </div>

                {/* Total Items Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">
                        إجمالي الأصناف
                      </p>
                      <p className="text-3xl font-bold font-mono">
                        {categoryMedicines.length}
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Total Stock Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <p className="text-emerald-100 text-sm mb-1">
                        إجمالي المخزون
                      </p>
                      <p className="text-3xl font-bold font-mono">
                        {totalStock}{" "}
                        <span className="text-sm font-normal text-emerald-100">
                          وحدة
                        </span>
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <Box className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Low Stock Alert Card */}
                <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <p className="text-rose-100 text-sm mb-1">أصناف منخفضة</p>
                      <p className="text-3xl font-bold font-mono">
                        {lowStockItems.length}
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Search Bar in one row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Status Badge */}
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border shadow-sm col-span-1">
                  <p className="text-sm font-bold text-gray-700">حالة الفئة:</p>
                  <Badge
                    variant={category.isActive ? "default" : "secondary"}
                    className={`font-bold px-4 py-1.5 text-sm ${
                      category.isActive
                        ? "bg-green-500 text-white border-green-600"
                        : "bg-gray-400 text-white border-gray-500"
                    }`}
                  >
                    {category.isActive ? "✅ نشطة" : "⏸️ غير نشطة"}
                  </Badge>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-3 rounded-xl border shadow-sm col-span-1 lg:col-span-2 flex items-center gap-3">
                  <div className="relative flex-1">
                    <Activity className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="البحث عن صنف بالاسم أو الكود..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 text-right border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className="font-bold bg-blue-50 border-blue-200 text-blue-700 px-4 py-2 text-sm whitespace-nowrap hidden sm:inline-flex"
                  >
                    نتائج البحث: {filteredMedicines.length}
                  </Badge>
                </div>
              </div>

              {/* Description (Optional) */}
              {category.description && (
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    وصف الفئة
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>
              )}

              {/* Items Table */}
              <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="bg-gray-50/80 px-4 py-3 border-b flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    قائمة الأصناف
                  </h3>
                  {searchQuery && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-md">
                      <Activity className="h-4 w-4" />
                      <span>
                        عرض {filteredMedicines.length} من أصل{" "}
                        {categoryMedicines.length}
                      </span>
                    </div>
                  )}
                </div>

                {filteredMedicines.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-12">
                    <div className="text-center">
                      <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium text-lg mb-2">
                        {searchQuery.trim()
                          ? "لا توجد نتائج للبحث"
                          : "لا توجد أصناف في هذه الفئة"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[800px] text-right">
                      <thead className="bg-gray-100/80 backdrop-blur-md sticky top-0 z-10 border-b shadow-sm">
                        <tr>
                          <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                            كود
                          </th>
                          <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                            اسم الصنف
                          </th>
                          <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
                            المخزون
                          </th>
                          <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
                            متوسط السعر
                          </th>
                          <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
                            الحد الأدنى
                          </th>
                          <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-start">
                            الحالة
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredMedicines.map((medicine) => {
                          const medicineTotalStock = medicine.variants.reduce(
                            (sum, variant) => sum + variant.stock,
                            0,
                          );
                          const hasLowStock = medicine.variants.some(
                            (variant) =>
                              medicine.minStock &&
                              variant.stock < medicine.minStock,
                          );
                          const avgPrice =
                            medicine.variants.reduce(
                              (sum, variant) => sum + variant.price,
                              0,
                            ) / medicine.variants.length;

                          return (
                            <tr
                              key={medicine.id}
                              className="hover:bg-blue-50/50 even:bg-gray-50/50 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm font-mono font-bold text-blue-600 whitespace-nowrap">
                                {medicine.code || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                <div>
                                  <div className="font-bold">
                                    {medicine.name}
                                  </div>
                                  {medicine.description && (
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                      {medicine.description}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  <span className="font-bold text-gray-900 text-base">
                                    {medicineTotalStock}
                                  </span>
                                  <span className="text-gray-500 text-xs bg-gray-200/70 px-2 py-1 rounded-md">
                                    {medicine.unit || "وحدة"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900 whitespace-nowrap">
                                {avgPrice.toFixed(2)} ج.م
                              </td>
                              <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  <span className="font-bold text-gray-900">
                                    {medicine.minStock || "0"}
                                  </span>
                                  <span className="text-gray-500 text-xs bg-gray-200/70 px-2 py-1 rounded-md">
                                    {medicine.unit || "وحدة"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-left whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {hasLowStock && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs bg-red-500 text-white border-red-600"
                                    >
                                      ⚠️ منخفض
                                    </Badge>
                                  )}
                                  {medicineTotalStock > 0 && !hasLowStock && (
                                    <Badge
                                      variant="default"
                                      className="text-xs bg-green-500 text-white border-green-600"
                                    >
                                      ✅ متوفر
                                    </Badge>
                                  )}
                                  {medicineTotalStock === 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-gray-400 text-white border-gray-500"
                                    >
                                      ⏸️ نفذ
                                    </Badge>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-gray-200 px-4 py-3 bg-white shrink-0 flex gap-4 mt-auto">
          <button
            onClick={onClose}
            className="flex-1 h-12 font-bold flex justify-center items-center border-2 hover:bg-gray-50 transition-all text-gray-700 rounded-lg border-gray-300"
          >
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </button>
          <button className="flex-1 h-12 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all rounded-lg">
            <Package className="h-4 w-4 ml-2" />
            طباعة التقرير
          </button>
        </div>
      </div>
    </div>
  );
}
