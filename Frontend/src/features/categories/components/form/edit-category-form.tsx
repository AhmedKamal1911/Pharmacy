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

const formSchema = z.object({
  categoryName: z
    .string()
    .min(2, "يجب أن يكون اسم الفئة 2 أحرف على الأقل.")
    .max(100, "يجب أن يكون اسم الفئة 100 حرف كحد أقصى."),
  description: z
    .string()
    .min(5, "يجب أن يكون الوصف 5 أحرف على الأقل.")
    .max(500, "يجب أن يكون الوصف 500 حرف كحد أقصى."),
});

export type CategoryFormData = z.infer<typeof formSchema>;

interface EditCategoryFormProps {
  onSubmit: (data: CategoryFormData) => void;
  initialData: CategoryFormData;
  isLoading?: boolean;
}

export function EditCategoryForm({
  onSubmit,
  initialData,
  isLoading,
}: EditCategoryFormProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="categoryName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="category-name">اسم الفئة</FieldLabel>
              <Input
                {...field}
                id="category-name"
                aria-invalid={fieldState.invalid}
                placeholder="أدخل اسم الفئة"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="category-description">الوصف</FieldLabel>
              <Input
                {...field}
                id="category-description"
                aria-invalid={fieldState.invalid}
                placeholder="أدخل وصف الفئة"
              />
              <FieldDescription>
                قم بإدخال وصف واضح للفئة لشرح محتواها
              </FieldDescription>
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
          {isLoading ? "جاري التعديل..." : "تعديل الفئة"}
        </Button>
      </div>
    </form>
  );
}
