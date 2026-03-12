"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Trash2, Plus, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/features/medicines/components/ui/category-selector";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const variantSchema = z.object({
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
  expiryDate: z.string().optional(),
  price: z.number().min(0.01, "سعر بيع الدفعة مطلوب"),
  cost: z.number().min(0, "تكلفة الدفعة مطلوبة"),
  stock: z.number().min(0),
});

const formSchema = z.object({
  name: z.string().min(3, "اسم الصنف قصير"),
  code: z.string().optional(),
  category: z.string().min(1, "اختر الفئة"),
  description: z.string().optional(),
  minStock: z.number().min(0),
  basePriceBatchIndex: z.number().min(0, "اختر الدفعة الأساسية"),
  variants: z.array(variantSchema).min(1, "يجب إضافة دفعة واحدة على الأقل"),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface EditMedicineFormProps {
  onSubmit: (data: FormSchemaType) => void;
  onCancel?: () => void;
  initialData?: FormSchemaType;
  isLoading?: boolean;
}

export function EditMedicineForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: EditMedicineFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      category: "",
      description: "",
      minStock: 0,
      basePriceBatchIndex: 0,
      variants: [
        { batchNumber: "", price: 0, cost: 0, stock: 0, expiryDate: "" },
      ],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      id="edit-medicine-form"
    >
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="name">اسم الدواء</FieldLabel>
              <Input
                id="name"
                {...register("name")}
                placeholder="أدخل اسم الدواء"
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="code">الكود</FieldLabel>
              <Input
                id="code"
                {...register("code")}
                placeholder="أدخل كود الدواء"
              />
              {errors.code && <FieldError>{errors.code.message}</FieldError>}
            </Field>

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>الفئة</FieldLabel>
                  <CategorySelector
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                  {errors.category && (
                    <FieldError>{errors.category.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="basePriceBatchIndex"
              control={control}
              render={({ field }) => (
                <Field className="md:col-span-2">
                  <FieldLabel>
                    <span className="flex items-center gap-2">
                      الدفعة ذات السعر الأساسي
                      <span className="text-xs text-gray-500 font-normal">
                        (سيتم استخدام سعر هذه الدفعة كالسعر الأساسي للصنف)
                      </span>
                    </span>
                  </FieldLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value.toString()}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختر الدفعة الأساسية" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((_, index) => {
                        const variant = fields[index];
                        return (
                          <SelectItem key={index} value={index.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>الدفعة {index + 1}</span>
                              {variant && (
                                <span className="text-sm text-gray-500 mr-2">
                                  {variant.price ? `${variant.price} ج.م` : "-"}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.basePriceBatchIndex && (
                    <FieldError>
                      {errors.basePriceBatchIndex.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="minStock">الحد الأدنى للمخزون</FieldLabel>
              <Input
                id="minStock"
                type="number"
                {...register("minStock", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.minStock && (
                <FieldError>{errors.minStock.message}</FieldError>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="description">الوصف</FieldLabel>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="أدخل وصف الدواء"
              rows={3}
            />
            {errors.description && (
              <FieldError>{errors.description.message}</FieldError>
            )}
          </Field>
        </CardContent>
      </Card>

      {/* Variants/Batches Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              الدفعات والمتغيرات
            </CardTitle>
            <Button
              type="button"
              onClick={() =>
                append({
                  batchNumber: "",
                  price: 0,
                  cost: 0,
                  stock: 0,
                  expiryDate: "",
                })
              }
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة دفعة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">الدفعة {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    size="sm"
                    variant="destructive"
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2  gap-3">
                  <Field>
                    <FieldLabel htmlFor={`batch-${index}`}>
                      رقم الدفعة
                    </FieldLabel>
                    <Input
                      id={`batch-${index}`}
                      {...register(`variants.${index}.batchNumber`)}
                      placeholder="أدخل رقم الدفعة"
                    />
                    {errors.variants?.[index]?.batchNumber && (
                      <FieldError>
                        {errors.variants[index]?.batchNumber?.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`cost-${index}`}>التكلفة</FieldLabel>
                    <Input
                      id={`cost-${index}`}
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.cost`, {
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                    />
                    {errors.variants?.[index]?.cost && (
                      <FieldError>
                        {errors.variants[index]?.cost?.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`price-${index}`}>
                      سعر البيع
                    </FieldLabel>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                    />
                    {errors.variants?.[index]?.price && (
                      <FieldError>
                        {errors.variants[index]?.price?.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`stock-${index}`}>المخزون</FieldLabel>
                    <Input
                      id={`stock-${index}`}
                      type="number"
                      {...register(`variants.${index}.stock`, {
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                    />
                    {errors.variants?.[index]?.stock && (
                      <FieldError>
                        {errors.variants[index]?.stock?.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`expiry-${index}`}>
                      تاريخ الانتهاء
                    </FieldLabel>
                    <Input
                      id={`expiry-${index}`}
                      type="date"
                      {...register(`variants.${index}.expiryDate`)}
                    />
                    {errors.variants?.[index]?.expiryDate && (
                      <FieldError>
                        {errors.variants[index]?.expiryDate?.message}
                      </FieldError>
                    )}
                  </Field>
                </div>
              </div>
            ))}

            {errors.variants && !errors.variants?.root && (
              <FieldError>{errors.variants.root?.message}</FieldError>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6"
          >
            إلغاء
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="px-6">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              جاري الحفظ...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
