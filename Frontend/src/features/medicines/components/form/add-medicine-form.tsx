"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Trash2, Plus, CheckCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/features/medicines/components/ui/category-selector";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const variantSchema = z.object({
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
  expiryDate: z.string().optional(),
  price: z.number().min(0.01, "سعر الدفعة مطلوب"),
  cost: z.number().min(0.01, "تكلفة الدفعة مطلوبة"),
  stock: z.number().min(0),
});

const formSchema = z.object({
  name: z.string().min(3, "اسم الصنف قصير"),
  code: z.string().optional(),
  category: z.string().min(1, "اختر الفئة"),
  description: z.string().optional(),
  unit: z.string(),
  minStock: z.number().min(0),
  variants: z.array(variantSchema).min(1, "يجب إضافة دفعة واحدة على الأقل"),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface MedicineFormProps {
  onSubmit: (
    data: FormSchemaType & { basePrice: number; cost: number },
  ) => void;
  initialData?: Partial<FormSchemaType>;
  isLoading?: boolean;
}

export function AddMedicineForm({
  onSubmit,
  initialData,
  isLoading,
}: MedicineFormProps) {
  const [selectedBaseVariant, setSelectedBaseVariant] = useState<number>(0);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      code: "",
      category: "",
      description: "",
      unit: "علبة",
      minStock: 5,
      variants: [
        {
          batchNumber: "",
          price: 0,
          cost: 0,
          stock: 0,
          expiryDate: "",
        },
      ],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const handleSubmitData = (data: FormSchemaType) => {
    // Set basePrice and cost from the selected base variant
    const baseVariant = data.variants[selectedBaseVariant];
    const enrichedData = {
      ...data,
      basePrice: baseVariant.price,
      cost: baseVariant.cost,
    };
    onSubmit(enrichedData);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmitData)}
      className="space-y-6"
      dir="rtl"
      id="medicine-form"
    >
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            البيانات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>اسم الصنف</FieldLabel>
                  <Input
                    {...field}
                    placeholder="مثال: Panadol 500mg"
                    className="h-10"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>الفئة</FieldLabel>
                  <CategorySelector
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="code"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Barcode</FieldLabel>
                  <Input
                    {...field}
                    placeholder="مثال: MED-001"
                    className="h-10"
                  />
                </Field>
              )}
            />

            <Controller
              name="unit"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>الوحدة</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="اختر الوحدة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="علبة">علبة</SelectItem>
                      <SelectItem value="عبوة">عبوة</SelectItem>
                      <SelectItem value="قطعة">قطعة</SelectItem>
                      <SelectItem value="شريط">شريط</SelectItem>
                      <SelectItem value="كبسولة">كبسولة</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="minStock"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>حد التنبيه</FieldLabel>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    placeholder="5"
                    className="h-10"
                  />
                </Field>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">الوصف</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="ملاحظات إضافية..."
                className="min-h-25 resize-none"
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">الدفعات</CardTitle>
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
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4 ml-1" />
            إضافة دفعة
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-700">
                      دفعة #{index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          selectedBaseVariant === index ? "default" : "outline"
                        }
                        onClick={() => {
                          setSelectedBaseVariant(index);
                        }}
                        className="h-6 px-2 text-xs"
                      >
                        {selectedBaseVariant === index ? (
                          <>
                            <CheckCircle className="w-3 h-3 ml-1" />
                            أساسي
                          </>
                        ) : (
                          "تعيين كأساسي"
                        )}
                      </Button>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => remove(index)}
                      className="h-8 px-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <FieldLabel className=" font-medium text-gray-600">
                      رقم الدفعة
                    </FieldLabel>
                    <Input
                      {...form.register(`variants.${index}.batchNumber`)}
                      placeholder="B-001"
                      className="h-9 text-sm"
                    />
                    {form.formState.errors.variants?.[index]?.batchNumber && (
                      <FieldError
                        errors={[
                          form.formState.errors.variants[index]?.batchNumber,
                        ]}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <FieldLabel className=" font-medium text-gray-600">
                      تاريخ الانتهاء
                    </FieldLabel>
                    <Input
                      type="date"
                      {...form.register(`variants.${index}.expiryDate`)}
                      className="h-9 text-sm"
                    />
                    {form.formState.errors.variants?.[index]?.expiryDate && (
                      <FieldError
                        errors={[
                          form.formState.errors.variants[index]?.expiryDate,
                        ]}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <FieldLabel className=" font-medium text-gray-600">
                      السعر
                    </FieldLabel>
                    <Input
                      type="number"
                      {...form.register(`variants.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      placeholder="0.00"
                      className="h-9 text-sm"
                    />
                    {form.formState.errors.variants?.[index]?.price && (
                      <FieldError
                        errors={[form.formState.errors.variants[index]?.price]}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <FieldLabel className=" font-medium text-gray-600">
                      التكلفة
                    </FieldLabel>
                    <Input
                      type="number"
                      {...form.register(`variants.${index}.cost`, {
                        valueAsNumber: true,
                      })}
                      placeholder="0.00"
                      className="h-9 text-sm"
                    />
                    {form.formState.errors.variants?.[index]?.cost && (
                      <FieldError
                        errors={[form.formState.errors.variants[index]?.cost]}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <FieldLabel className=" font-medium text-gray-600">
                      المخزون
                    </FieldLabel>
                    <Input
                      type="number"
                      {...form.register(`variants.${index}.stock`, {
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                      className="h-9 text-sm"
                    />
                    {form.formState.errors.variants?.[index]?.stock && (
                      <FieldError
                        errors={[form.formState.errors.variants[index]?.stock]}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Save Button */}
      <div className="flex justify-center pt-6 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-200"
        >
          {isLoading ? "جاري الحفظ..." : "حفظ الصنف"}
        </Button>
      </div>
    </form>
  );
}
