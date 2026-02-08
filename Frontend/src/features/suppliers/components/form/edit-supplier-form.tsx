import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SupplierType } from "../../types";

const formSchema = z.object({
  short: z
    .string()
    .min(2, "يجب أن يكون الاختصار 2 أحرف على الأقل.")
    .max(5, "يجب أن يكون الاختصار 5 أحرف كحد أقصى.")
    .regex(/^[A-Z]+$/, "يجب أن يكون الاختصار حروف إنجليزية كبيرة فقط."),
  name: z
    .string()
    .min(3, "يجب أن يكون اسم المورد 3 أحرف على الأقل.")
    .max(100, "يجب أن يكون اسم المورد 100 حرف كحد أقصى."),
  supplierType: z.enum(["WAREHOUSE", "COMPANY", "PERSON"]),
  debit: z.number().min(0, "يجب أن تكون المديونية غير سالبة"),
  paymentPeriodMonths: z.number().min(0, "يجب أن تكون فترة الأجل غير سالبة"),
  landlinePhone: z.string().optional(),
  mobilePhone: z
    .string()
    .regex(/^05\d{8}$/, "يجب أن يبدأ رقم الهاتف ب 05 ويكون 10 أرقام."),
});

export type SupplierFormData = z.infer<typeof formSchema>;

interface EditSupplierFormProps {
  onSubmit: (data: SupplierFormData) => void;
  initialData: Partial<SupplierFormData>;
  isLoading?: boolean;
}

export function EditSupplierForm({
  onSubmit,
  initialData,
  isLoading,
}: EditSupplierFormProps) {
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      short: "",
      name: "",
      supplierType: "COMPANY",
      debit: 0,
      paymentPeriodMonths: 0,
      landlinePhone: "",
      mobilePhone: "",
      ...initialData,
    },
  });

  const handleSubmit = (data: SupplierFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="short"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="supplier-short">الاختصار</FieldLabel>
              <Input
                {...field}
                id="supplier-short"
                aria-invalid={fieldState.invalid}
                placeholder="ACD"
                className="font-mono uppercase"
                maxLength={5}
              />
              <FieldDescription>
                اختصار المورد (حروف إنجليزية كبيرة فقط)
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="supplier-name">اسم المورد</FieldLabel>
              <Input
                {...field}
                id="supplier-name"
                aria-invalid={fieldState.invalid}
                placeholder="أدخل اسم المورد"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="supplierType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="supplier-type">نوع المورد</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as SupplierType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع المورد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WAREHOUSE">مخزن</SelectItem>
                  <SelectItem value="COMPANY">شركة</SelectItem>
                  <SelectItem value="PERSON">فرد</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="mobilePhone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="supplier-mobile">رقم المحمول</FieldLabel>
              <Input
                {...field}
                id="supplier-mobile"
                aria-invalid={fieldState.invalid}
                placeholder="05xxxxxxxx"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="landlinePhone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="supplier-landline">
                رقم الأرضي (اختياري)
              </FieldLabel>
              <Input
                {...field}
                id="supplier-landline"
                aria-invalid={fieldState.invalid}
                placeholder="أدخل رقم الهاتف الأرضي"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="debit"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="supplier-debit">المديونية</FieldLabel>
              <Input
                {...field}
                id="supplier-debit"
                type="number"
                min="0"
                step="0.01"
                aria-invalid={fieldState.invalid}
                placeholder="0.00"
                onChange={(e) =>
                  field.onChange(parseFloat(e.target.value) || 0)
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="paymentPeriodMonths"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="supplier-payment-period">
                فترة الأجل (بالشهور)
              </FieldLabel>
              <Input
                {...field}
                id="supplier-payment-period"
                type="number"
                min="0"
                step="1"
                aria-invalid={fieldState.invalid}
                placeholder="0"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
              <FieldDescription>فترة السماح للسداد بالشهور</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          إعادة تعيين
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "جاري التحديث..." : "تحديث مورد"}
        </Button>
      </div>
    </form>
  );
}
