import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import type { PurchaseItem } from "../../types";

const purchaseItemSchema = z.object({
  medicineCode: z.string().min(1, "كود الدواء مطلوب"),
  medicineName: z.string().min(1, "اسم الصنف مطلوب"),
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
                name={`items.${index}.medicineCode`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`code-${item.id}`}>
                      كود الدواء
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`code-${item.id}`}
                      aria-invalid={fieldState.invalid}
                      placeholder="مثل: MED001"
                      value={item.medicineCode}
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
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`name-${item.id}`}>
                      اسم الصنف
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`name-${item.id}`}
                      aria-invalid={fieldState.invalid}
                      placeholder="اسم الدواء"
                      value={item.medicineName}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        onUpdateItem(item.id, "medicineName", e.target.value);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
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
                name={`items.${index}.expiryDate`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`expiry-${item.id}`}>
                      تاريخ الصلاحية
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`expiry-${item.id}`}
                      type="date"
                      aria-invalid={fieldState.invalid}
                      value={item.expiryDate}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        onUpdateItem(item.id, "expiryDate", e.target.value);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
