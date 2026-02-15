import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { PurchaseItem } from "../../types";
import { MedicineSelector } from "@/features/medicines/components/medicine-selector";

const purchaseItemSchema = z.object({
  medicineId: z.string().min(1, "اختيار الصنف مطلوب"),
  medicineName: z.string().min(1, "اسم الصنف مطلوب"),
  medicineCode: z.string().optional(),
  quantity: z.number().min(1, "الكمية يجب أن تكون 1 على الأقل"),
  unitsPerPackage: z.number().min(1, "الوحدات يجب أن تكون 1 على الأقل"),
  salePrice: z.number().min(0, "سعر البيع يجب أن يكون غير سالب"),
  tax: z.number().min(0).max(100, "الضريبة بين 0 و 100"),
  mainDiscount: z.number().min(0).max(100, "الخصم بين 0 و 100"),
  extraDiscount: z.number().min(0).max(100, "الخصم الإضافي بين 0 و 100"),
  cost: z.number().min(0, "التكلفة يجب أن تكون غير سالبة"),
  expiryDate: z.string().optional(),
  expirable: z.boolean(),
  bonus: z.number().min(0, "البونص يجب أن يكون غير سالب"),
});

const purchaseItemsSchema = z.object({
  items: z.array(purchaseItemSchema),
});

export type PurchaseItemsFormData = z.infer<typeof purchaseItemsSchema>;

interface PurchaseItemsFormProps {
  items: PurchaseItem[];
  onAddItem: () => void;
  onUpdateItem: (
    id: string,
    field: keyof PurchaseItem,
    value: string | number | boolean,
  ) => void;
  onRemoveItem: (id: string) => void;
}

export function PurchaseItemsForm({
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: PurchaseItemsFormProps) {
  const form = useForm<PurchaseItemsFormData>({
    resolver: zodResolver(purchaseItemsSchema),
    defaultValues: {
      items: items,
    },
  });

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-slate-900">الأصناف ({items.length})</h4>
        <Button
          onClick={onAddItem}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          إضافة صنف
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-lg p-4 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-900">صنف #{index + 1}</h4>
              {items.length > 1 && (
                <Button
                  onClick={() => onRemoveItem(item.id)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Controller
                name={`items.${index}.medicineId`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`medicine-${item.id}`}>
                      الصنف *
                    </FieldLabel>
                    <MedicineSelector
                      value={field.value}
                      onValueChange={(
                        medicineId,
                        medicineName,
                        medicineCode,
                      ) => {
                        field.onChange(medicineId);
                        onUpdateItem(item.id, "medicineId", medicineId);
                        onUpdateItem(item.id, "medicineName", medicineName);
                        // Also update the medicine code if provided
                        if (medicineCode) {
                          onUpdateItem(item.id, "medicineCode", medicineCode);
                        }
                        // Also update the form state for medicineName and medicineCode
                        form.setValue(
                          `items.${index}.medicineName`,
                          medicineName,
                        );
                        if (medicineCode) {
                          form.setValue(
                            `items.${index}.medicineCode`,
                            medicineCode,
                          );
                        }
                      }}
                      placeholder="اختر الصنف"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`items.${index}.medicineCode`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`code-${item.id}`}>
                      كود الصنف
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`code-${item.id}`}
                      aria-invalid={fieldState.invalid}
                      placeholder="مثل: MED001"
                      value={item.medicineCode || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        onUpdateItem(item.id, "medicineCode", e.target.value);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`items.${index}.medicineName`}
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FieldLabel htmlFor={`name-display-${item.id}`}>
                      اسم الصنف
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`name-display-${item.id}`}
                      value={field.value}
                      disabled
                      className="bg-gray-50"
                      placeholder="سيتم ملؤه تلقائياً"
                    />
                  </div>
                )}
              />

              <Controller
                name={`items.${index}.quantity`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`quantity-${item.id}`}>
                      الكمية
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      aria-invalid={fieldState.invalid}
                      value={item.quantity}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value) || 1);
                        onUpdateItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 1,
                        );
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`items.${index}.salePrice`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`salePrice-${item.id}`}>
                      سعر البيع
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`salePrice-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      aria-invalid={fieldState.invalid}
                      value={item.salePrice}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value) || 0);
                        onUpdateItem(
                          item.id,
                          "salePrice",
                          parseFloat(e.target.value) || 0,
                        );
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`items.${index}.cost`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`cost-${item.id}`}>التكلفة</FieldLabel>
                    <Input
                      {...field}
                      id={`cost-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      aria-invalid={fieldState.invalid}
                      value={item.cost}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value) || 0);
                        onUpdateItem(
                          item.id,
                          "cost",
                          parseFloat(e.target.value) || 0,
                        );
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`items.${index}.tax`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`tax-${item.id}`}>
                      الضريبة (%)
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`tax-${item.id}`}
                      type="number"
                      min="0"
                      max="100"
                      aria-invalid={fieldState.invalid}
                      value={item.tax}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value) || 0);
                        onUpdateItem(
                          item.id,
                          "tax",
                          parseFloat(e.target.value) || 0,
                        );
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`items.${index}.mainDiscount`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`discount-${item.id}`}>
                      الخصم (%)
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`discount-${item.id}`}
                      type="number"
                      min="0"
                      max="100"
                      aria-invalid={fieldState.invalid}
                      value={item.mainDiscount}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value) || 0);
                        onUpdateItem(
                          item.id,
                          "mainDiscount",
                          parseFloat(e.target.value) || 0,
                        );
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`items.${index}.bonus`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`bonus-${item.id}`}>بونص</FieldLabel>
                    <Input
                      {...field}
                      id={`bonus-${item.id}`}
                      type="number"
                      min="0"
                      aria-invalid={fieldState.invalid}
                      value={item.bonus || 0}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value) || 0);
                        onUpdateItem(
                          item.id,
                          "bonus",
                          parseInt(e.target.value) || 0,
                        );
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`items.${index}.expirable`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`expirable-${item.id}`}>
                      منتهي الصلاحية
                    </FieldLabel>
                    <Select
                      value={field.value ? "yes" : "no"}
                      onValueChange={(value) => {
                        const isExpirable = value === "yes";
                        field.onChange(isExpirable);
                        onUpdateItem(item.id, "expirable", isExpirable);
                        // Clear expiry date if not expirable
                        if (!isExpirable) {
                          onUpdateItem(item.id, "expiryDate", "");
                          form.setValue(`items.${index}.expiryDate`, "");
                        }
                      }}
                    >
                      <SelectTrigger id={`expirable-${item.id}`}>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">نعم</SelectItem>
                        <SelectItem value="no">لا</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`items.${index}.expiryDate`}
                control={form.control}
                render={({ field, fieldState }) => {
                  const isExpirable = form.getValues(
                    `items.${index}.expirable`,
                  );
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`expiry-${item.id}`}>
                        تاريخ الصلاحية
                      </FieldLabel>
                      <Input
                        {...field}
                        id={`expiry-${item.id}`}
                        type="date"
                        aria-invalid={fieldState.invalid}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          onUpdateItem(item.id, "expiryDate", e.target.value);
                        }}
                        disabled={!isExpirable}
                        className={
                          !isExpirable ? "bg-gray-100 cursor-not-allowed" : ""
                        }
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
