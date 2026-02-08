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

import type { CustomerType } from "../../types";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "يجب أن يكون اسم العميل 3 أحرف على الأقل.")
    .max(100, "يجب أن يكون اسم العميل 100 حرف كحد أقصى."),
  phone: z
    .string()
    .regex(/^05\d{8}$/, "يجب أن يبدأ رقم الهاتف ب 05 ويكون 10 أرقام."),
  address: z
    .string()
    .min(5, "يجب أن يكون العنوان 5 أحرف على الأقل.")
    .max(200, "يجب أن يكون العنوان 200 حرف كحد أقصى."),
  type: z.enum(["PERSON", "COMPANY"]),
  isCashOnly: z.boolean(),
  balance: z.number(),
  creditLimit: z.number().min(0, "يجب أن يكون حد الائتمان غير سالب"),
  localDiscount: z
    .number()
    .min(0)
    .max(100, "يجب أن يكون الخصم المحلي بين 0 و 100"),
  importDiscount: z
    .number()
    .min(0)
    .max(100, "يجب أن يكون خصم الاستيراد بين 0 و 100"),
});

export type CustomerFormData = z.infer<typeof formSchema>;

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  initialData?: Partial<CustomerFormData>;
  isLoading?: boolean;
}

export function AddCustomerForm({
  onSubmit,
  initialData,
  isLoading,
}: CustomerFormProps) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      type: "PERSON",
      isCashOnly: false,
      balance: 0,
      creditLimit: 0,
      localDiscount: 0,
      importDiscount: 0,
      ...initialData,
    },
  });

  const handleSubmit = (data: CustomerFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer-name">اسم العميل</FieldLabel>
              <Input
                {...field}
                id="customer-name"
                aria-invalid={fieldState.invalid}
                placeholder="أدخل اسم العميل"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer-phone">رقم الهاتف</FieldLabel>
              <Input
                {...field}
                id="customer-phone"
                aria-invalid={fieldState.invalid}
                placeholder="05xxxxxxxx"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer-address">العنوان</FieldLabel>
              <Input
                {...field}
                id="customer-address"
                aria-invalid={fieldState.invalid}
                placeholder="أدخل عنوان العميل"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="type"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer-type">نوع العميل</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as CustomerType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع العميل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERSON">فرد</SelectItem>
                  <SelectItem value="COMPANY">شركة</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="isCashOnly"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="customer-cash-only">
                الدفع نقداً فقط
              </FieldLabel>
              <Select
                value={field.value.toString()}
                onValueChange={(value) => field.onChange(value === "true")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الخيار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">لا</SelectItem>
                  <SelectItem value="true">نعم</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                قم بتفعيل هذا الخيار إذا كان العميل يدفع نقداً فقط
              </FieldDescription>
            </Field>
          )}
        />

        <Controller
          name="creditLimit"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer-credit-limit">
                حد الائتمان
              </FieldLabel>
              <Input
                {...field}
                id="customer-credit-limit"
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
          name="localDiscount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer-local-discount">
                الخصم المحلي (%)
              </FieldLabel>
              <Input
                {...field}
                id="customer-local-discount"
                type="number"
                min="0"
                max="100"
                step="0.1"
                aria-invalid={fieldState.invalid}
                placeholder="0"
                onChange={(e) =>
                  field.onChange(parseFloat(e.target.value) || 0)
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="importDiscount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer-import-discount">
                خصم الاستيراد (%)
              </FieldLabel>
              <Input
                {...field}
                id="customer-import-discount"
                type="number"
                min="0"
                max="100"
                step="0.1"
                aria-invalid={fieldState.invalid}
                placeholder="0"
                onChange={(e) =>
                  field.onChange(parseFloat(e.target.value) || 0)
                }
              />
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
          {isLoading ? "جاري الإنشاء..." : "إنشاء عميل"}
        </Button>
      </div>
    </form>
  );
}
