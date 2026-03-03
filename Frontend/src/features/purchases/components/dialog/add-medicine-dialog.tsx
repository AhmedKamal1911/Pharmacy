import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Package, Pill } from "lucide-react";
import { MedicineSelector } from "@/features/medicines/components/medicine-selector";
import { MedicineVariantSelector } from "@/features/medicines/components/medicine-variant-selector";
import type { PurchaseItem } from "@/features/purchases/types";
import type { MedicineVariant, Medicine } from "@/data/medicines";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddItemDialogProps {
  onItemSelect: (newItem: PurchaseItem, newMedicine?: Medicine) => void;
}

export function AddItemDialog({ onItemSelect }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>("");
  const [selectedMedicineName, setSelectedMedicineName] = useState<string>("");
  const [selectedMedicineCode, setSelectedMedicineCode] = useState<string>("");
  const [selectedVariant, setSelectedVariant] =
    useState<MedicineVariant | null>(null);
  const [showNewVariantForm, setShowNewVariantForm] = useState(false);
  const [showNewMedicineForm, setShowNewMedicineForm] = useState(false);
  const [newVariantData, setNewVariantData] = useState({
    costPrice: "",
    salePrice: "",
    expiryDate: "",
    batchNumber: "",
  });
  const [newMedicineData, setNewMedicineData] = useState({
    name: "",
    code: "",
    description: "",
    category: "",
    unit: "",
  });

  const medicineUnits = [
    "علبة",
    "زجاجة",
    "عبوة",
    "أمبولة",
    "كبسولة",
    "قرص",
    "شراب",
    "كريم",
    "مرهم",
    "بخاخ",
    "قطرة",
    "أخرى",
  ];

  const medicineCategories = [
    "مسكنات",
    "مضادات حيوية",
    "مضادات حموضة",
    "ضغط دم",
    "سكري",
    "مضادات هيستامين",
    "منشطات حركة",
    "غثيان",
    "أمراض معدية",
    "مزيلات احتقان",
    "مكملات غذائية",
    "فيتامينات",
    "أخرى",
  ];
  const idCounter = useRef(0);

  const generateId = useCallback(() => {
    idCounter.current += 1;
    return `${Date.now()}-${idCounter.current}`;
  }, []);

  const handleMedicineSelect = (
    medicineId: string,
    medicineName: string,
    medicineCode?: string,
  ) => {
    setSelectedMedicineId(medicineId);
    setSelectedMedicineName(medicineName);
    setSelectedMedicineCode(medicineCode || "");
    setSelectedVariant(null);
    setShowNewVariantForm(false);
  };

  const handleVariantSelect = (
    _variantId: string,
    variant: MedicineVariant,
  ) => {
    setSelectedVariant(variant);
    setShowNewVariantForm(false);
  };

  const handleAddNewVariant = () => {
    setShowNewVariantForm(true);
    setSelectedVariant(null);
  };

  const handleAddNewMedicine = () => {
    setShowNewMedicineForm(true);
    setSelectedMedicineId("");
    setSelectedMedicineName("");
    setSelectedMedicineCode("");
    setSelectedVariant(null);
    setShowNewVariantForm(false);
  };

  const handleSelectExistingMedicine = () => {
    setShowNewMedicineForm(false);
    setNewMedicineData({
      name: "",
      code: "",
      description: "",
      category: "",
      unit: "",
    });
  };

  const handleConfirmItem = () => {
    let finalMedicineId = selectedMedicineId;
    let finalMedicineName = selectedMedicineName;
    let finalMedicineCode = selectedMedicineCode;
    let newMedicine: Medicine | undefined;

    // If creating new medicine
    if (showNewMedicineForm && newMedicineData.name) {
      finalMedicineId = `MED-${generateId()}`;
      finalMedicineName = newMedicineData.name;
      finalMedicineCode = newMedicineData.code || `CODE-${generateId()}`;

      // Create new medicine object
      newMedicine = {
        id: finalMedicineId,
        name: finalMedicineName,
        code: finalMedicineCode,
        category: newMedicineData.category || "أخرى",
        description: newMedicineData.description || undefined,
        unit: newMedicineData.unit || undefined,
        variants: [], // Will be populated with the new variant
      };
    }

    if (!finalMedicineId) return;

    let finalVariant = selectedVariant;

    // Create new variant for both existing and new medicines
    if (
      (showNewVariantForm || showNewMedicineForm) &&
      newVariantData.costPrice
    ) {
      finalVariant = {
        id: `${finalMedicineId}-V${generateId()}`,
        price: parseFloat(newVariantData.costPrice),
        expiryDate: newVariantData.expiryDate || undefined,
        batchNumber: newVariantData.batchNumber || undefined,
        stock: 0, // Will be updated when purchase is completed
      };

      // Add variant to new medicine if applicable
      if (newMedicine) {
        newMedicine.variants = [finalVariant];
      }
    }

    const newItem: PurchaseItem = {
      id: generateId(),
      medicineId: finalMedicineId,
      medicineCode: finalMedicineCode,
      medicineName: finalMedicineName,

      // Variant information
      variantId: finalVariant?.id,
      variantPrice: finalVariant?.price,
      variantExpiryDate: finalVariant?.expiryDate,
      variantBatchNumber: finalVariant?.batchNumber,

      quantity: 1,
      unitsPerPackage: 1,
      salePrice:
        parseFloat(newVariantData.salePrice) ||
        parseFloat(newVariantData.costPrice) ||
        0,
      tax: 14,
      mainDiscount: 0,
      extraDiscount: 0,
      cost: parseFloat(newVariantData.costPrice) || 0,
      expiryDate: finalVariant?.expiryDate || "",
      expirable: !!finalVariant?.expiryDate,
      bonus: 0,
      isNewMedicine: showNewMedicineForm,
    };

    onItemSelect(newItem, newMedicine);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setSelectedMedicineId("");
    setSelectedMedicineName("");
    setSelectedMedicineCode("");
    setSelectedVariant(null);
    setShowNewVariantForm(false);
    setShowNewMedicineForm(false);
    setNewVariantData({
      costPrice: "",
      salePrice: "",
      expiryDate: "",
      batchNumber: "",
    });
    setNewMedicineData({
      name: "",
      code: "",
      description: "",
      category: "",
      unit: "",
    });
  };

  const canConfirm =
    (showNewMedicineForm &&
      newMedicineData.name &&
      newMedicineData.category &&
      newMedicineData.unit &&
      newVariantData.costPrice) ||
    (!showNewMedicineForm &&
      selectedMedicineId &&
      (selectedVariant || (showNewVariantForm && newVariantData.costPrice)));

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

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="pt-4 pb-4">
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            إضافة صنف للفاتورة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Toggle between existing and new medicine */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <Button
              variant={showNewMedicineForm ? "outline" : "default"}
              size="sm"
              onClick={handleSelectExistingMedicine}
              className={cn(
                "flex-1",
                !showNewMedicineForm && "bg-blue-600 hover:bg-blue-700",
              )}
            >
              <Package className="w-4 h-4 ml-1" />
              صنف موجود
            </Button>
            <Button
              variant={showNewMedicineForm ? "default" : "outline"}
              size="sm"
              onClick={handleAddNewMedicine}
              className={cn(
                "flex-1",
                showNewMedicineForm && "bg-blue-600 hover:bg-blue-700",
              )}
            >
              <Plus className="w-4 h-4 ml-1" />
              صنف جديد
            </Button>
          </div>

          {/* Step 1: Select or Create Medicine */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  (selectedMedicineId && !showNewMedicineForm) ||
                    (showNewMedicineForm && newMedicineData.name)
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700",
                )}
              >
                {(selectedMedicineId && !showNewMedicineForm) ||
                (showNewMedicineForm && newMedicineData.name)
                  ? "✓"
                  : "1"}
              </div>
              <Label className="font-medium text-slate-900">
                {showNewMedicineForm ? "إنشاء صنف جديد" : "اختر الصنف"}
              </Label>
            </div>

            {!showNewMedicineForm ? (
              <>
                <MedicineSelector
                  value={selectedMedicineId}
                  onValueChange={handleMedicineSelect}
                  placeholder="ابحث عن الصنف..."
                />

                {selectedMedicineName && (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                    <span className="font-medium">{selectedMedicineName}</span>
                    <Badge className="bg-blue-100 text-blue-700 mr-2 text-xs">
                      {selectedMedicineCode}
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <div className="max-h-[50vh] overflow-y-auto p-4 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="w-4 h-4 text-slate-600" />
                  <h4 className="font-medium text-slate-900">إضافة صنف جديد</h4>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="medicineName"
                        className="text-sm font-medium text-slate-700"
                      >
                        اسم الصنف <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="medicineName"
                        placeholder="أدخل اسم الصنف"
                        value={newMedicineData.name}
                        onChange={(e) =>
                          setNewMedicineData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="medicineCode"
                        className="text-sm font-medium text-slate-700"
                      >
                        الكود
                      </Label>
                      <Input
                        id="medicineCode"
                        placeholder="سيتم إنشاؤه تلقائياً"
                        value={newMedicineData.code}
                        onChange={(e) =>
                          setNewMedicineData((prev) => ({
                            ...prev,
                            code: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="medicineCategory"
                        className="text-sm font-medium text-slate-700"
                      >
                        التصنيف <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newMedicineData.category}
                        onValueChange={(value) =>
                          setNewMedicineData((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="اختر التصنيف" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicineCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="medicineUnit"
                        className="text-sm font-medium text-slate-700"
                      >
                        الوحدة <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newMedicineData.unit}
                        onValueChange={(value) =>
                          setNewMedicineData((prev) => ({
                            ...prev,
                            unit: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="اختر الوحدة" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicineUnits.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="medicineDescription"
                        className="text-sm font-medium text-slate-700"
                      >
                        الوصف
                      </Label>
                      <Input
                        id="medicineDescription"
                        placeholder="مثال: مسكن ألم وخافض حرارة، يستخدم لتخفيف الآلام الخفيفة إلى المتوسطة"
                        value={newMedicineData.description}
                        onChange={(e) =>
                          setNewMedicineData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Variant Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Plus className="w-4 h-4 text-slate-600" />
                      <h4 className="font-medium text-slate-900">
                        بيانات المتغير (سعر وتفاصيل الشراء)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="costPrice"
                          className="text-sm font-medium text-slate-700"
                        >
                          سعر التكلفة <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="costPrice"
                          type="number"
                          placeholder="0.00"
                          value={newVariantData.costPrice}
                          onChange={(e) =>
                            setNewVariantData((prev) => ({
                              ...prev,
                              costPrice: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="salePrice"
                          className="text-sm font-medium text-slate-700"
                        >
                          سعر البيع
                        </Label>
                        <Input
                          id="salePrice"
                          type="number"
                          placeholder="0.00"
                          value={newVariantData.salePrice}
                          onChange={(e) =>
                            setNewVariantData((prev) => ({
                              ...prev,
                              salePrice: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="expiryDate"
                          className="text-sm font-medium text-slate-700"
                        >
                          تاريخ الانتهاء
                        </Label>
                        <Input
                          id="expiryDate"
                          placeholder="12/26"
                          value={newVariantData.expiryDate}
                          onChange={(e) =>
                            setNewVariantData((prev) => ({
                              ...prev,
                              expiryDate: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="batchNumber"
                          className="text-sm font-medium text-slate-700"
                        >
                          رقم الباتش
                        </Label>
                        <Input
                          id="batchNumber"
                          placeholder="اختياري"
                          value={newVariantData.batchNumber}
                          onChange={(e) =>
                            setNewVariantData((prev) => ({
                              ...prev,
                              batchNumber: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Simple Preview */}
                    {newVariantData.costPrice && (
                      <div className="mt-3 p-2 bg-slate-50 rounded text-sm text-slate-600">
                        <div className="flex gap-4">
                          <span>
                            سعر التكلفة: {newVariantData.costPrice} جنيه
                          </span>
                          {newVariantData.salePrice && (
                            <span>
                              سعر البيع: {newVariantData.salePrice} جنيه
                            </span>
                          )}
                          {newVariantData.expiryDate &&
                            ` • انتهاء: ${newVariantData.expiryDate}`}
                          {newVariantData.batchNumber &&
                            ` • باتش: ${newVariantData.batchNumber}`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* New Medicine Preview */}
                {newMedicineData.name && (
                  <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-900">
                        {newMedicineData.name}
                      </span>
                      {newMedicineData.category && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          {newMedicineData.category}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs text-blue-700">
                      {newMedicineData.unit && (
                        <span>الوحدة: {newMedicineData.unit}</span>
                      )}
                    </div>
                    {newMedicineData.description && (
                      <p className="text-sm text-blue-700 mt-2">
                        {newMedicineData.description}
                      </p>
                    )}
                    {newMedicineData.code && (
                      <p className="text-xs text-blue-600 mt-1">
                        الكود: {newMedicineData.code}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Select Variant or Add New */}
          {((selectedMedicineId && !showNewMedicineForm) ||
            (showNewMedicineForm && newMedicineData.name)) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                    selectedVariant ||
                      (showNewMedicineForm && newVariantData.costPrice)
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700",
                  )}
                >
                  {selectedVariant ||
                  (showNewMedicineForm && newVariantData.costPrice)
                    ? "✓"
                    : "2"}
                </div>
                <Label className="font-medium text-slate-900">
                  {!showNewMedicineForm
                    ? "اختر المتغير أو أضف جديداً"
                    : "تم إضافة المتغير للصنف الجديد"}
                </Label>
              </div>

              {!showNewMedicineForm && (
                <MedicineVariantSelector
                  medicineId={selectedMedicineId}
                  value={selectedVariant?.id}
                  onValueChange={handleVariantSelect}
                  onAddNewVariant={handleAddNewVariant}
                  placeholder="اختر المتغير المطلوب"
                />
              )}

              {showNewMedicineForm && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                  <p className="text-green-800">
                    ✓ بيانات المتغير مضافة ضمن نموذج الصنف الجديد أعلاه
                  </p>
                </div>
              )}

              {/* New Variant Form for Existing Medicine */}
              {showNewVariantForm && !showNewMedicineForm && (
                <div className="p-4 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Plus className="w-4 h-4 text-slate-600" />
                    <h4 className="font-medium text-slate-900">
                      إضافة متغير جديد لـ {selectedMedicineName}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="existingCostPrice"
                        className="text-sm font-medium text-slate-700"
                      >
                        سعر التكلفة <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="existingCostPrice"
                        type="number"
                        placeholder="0.00"
                        value={newVariantData.costPrice}
                        onChange={(e) =>
                          setNewVariantData((prev) => ({
                            ...prev,
                            costPrice: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="existingSalePrice"
                        className="text-sm font-medium text-slate-700"
                      >
                        سعر البيع
                      </Label>
                      <Input
                        id="existingSalePrice"
                        type="number"
                        placeholder="0.00"
                        value={newVariantData.salePrice}
                        onChange={(e) =>
                          setNewVariantData((prev) => ({
                            ...prev,
                            salePrice: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="existingExpiryDate"
                        className="text-sm font-medium text-slate-700"
                      >
                        تاريخ الانتهاء
                      </Label>
                      <Input
                        id="existingExpiryDate"
                        placeholder="12/26"
                        value={newVariantData.expiryDate}
                        onChange={(e) =>
                          setNewVariantData((prev) => ({
                            ...prev,
                            expiryDate: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="existingBatchNumber"
                        className="text-sm font-medium text-slate-700"
                      >
                        رقم الباتش
                      </Label>
                      <Input
                        id="existingBatchNumber"
                        placeholder="اختياري"
                        value={newVariantData.batchNumber}
                        onChange={(e) =>
                          setNewVariantData((prev) => ({
                            ...prev,
                            batchNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  {newVariantData.costPrice && (
                    <div className="mt-3 p-2 bg-slate-50 rounded text-sm text-slate-600">
                      <div className="flex gap-4">
                        <span>
                          سعر التكلفة: {newVariantData.costPrice} جنيه
                        </span>
                        {newVariantData.salePrice && (
                          <span>
                            سعر البيع: {newVariantData.salePrice} جنيه
                          </span>
                        )}
                        {newVariantData.expiryDate &&
                          ` • انتهاء: ${newVariantData.expiryDate}`}
                        {newVariantData.batchNumber &&
                          ` • باتش: ${newVariantData.batchNumber}`}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Selected Variant Display */}
              {selectedVariant && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      السعر:{" "}
                      <span className="text-green-700">
                        {selectedVariant.price} جنيه
                      </span>
                    </span>
                    {selectedVariant.expiryDate && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 text-xs"
                      >
                        انتهاء: {selectedVariant.expiryDate}
                      </Badge>
                    )}
                    {selectedVariant.batchNumber && (
                      <Badge variant="outline" className="text-xs">
                        {selectedVariant.batchNumber}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span
              className={cn(
                "text-sm",
                canConfirm ? "text-green-600" : "text-amber-600",
              )}
            >
              {canConfirm
                ? showNewMedicineForm
                  ? "✓ جاهز لإضافة الصنف الجديد"
                  : "✓ جاهز للإضافة"
                : "⚠ يرجى إكمال البيانات"}
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
                size="sm"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleConfirmItem}
                disabled={!canConfirm}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {showNewMedicineForm ? "إضافة الصنف الجديد" : "إضافة الصنف"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
