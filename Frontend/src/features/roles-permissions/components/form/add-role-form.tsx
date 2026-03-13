import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PERMISSION_GROUPS,
  ROLE_CODES,
  formatPermissionName,
  type PermissionGroup,
  type PermissionKey,
} from "@/data/roles-permissions";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  roleName: z
    .string()
    .min(2, "يجب أن يكون اسم الدور مكوناً من حرفين على الأقل.")
    .max(50, "يجب أن لا يزيد اسم الدور عن 50 حرفاً."),
  roleCode: z.enum(Object.values(ROLE_CODES) as [string, ...string[]], {
    message: "يجب اختيار رمز دور صالح من القائمة.",
  }),
  description: z
    .string()
    .min(5, "يجب أن يكون الوصف مكوناً من 5 أحرف على الأقل.")
    .max(500, "يجب أن لا يزيد الوصف عن 500 حرف."),
  permissions: z
    .array(z.string().min(1)) // Using string validation since PermissionKey is a string type
    .min(1, "يجب اختيار صلاحية واحدة على الأقل."),
});

export type RoleFormData = z.infer<typeof formSchema>;

interface RoleFormProps {
  onSubmit: (data: RoleFormData) => void;
  initialData?: Partial<RoleFormData>;
  isLoading?: boolean;
  onCancel?: () => void; // Added to handle closing the dialog
  showActions?: boolean; // Added to control action buttons visibility
}

export function AddRoleForm({
  onSubmit,
  initialData,
  isLoading,
  onCancel,
  showActions = true,
}: RoleFormProps) {
  const form = useForm<RoleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleName: "",
      roleCode: "",
      description: "",
      permissions: [],
      ...initialData,
    },
  });

  const handleSubmit = (data: RoleFormData) => {
    onSubmit(data);
  };

  const handlePermissionChange = (permissionKey: string, checked: boolean) => {
    const currentPermissions = form.getValues("permissions") || [];

    if (checked) {
      form.setValue("permissions", [...currentPermissions, permissionKey], {
        shouldValidate: true,
      });
    } else {
      form.setValue(
        "permissions",
        currentPermissions.filter((p) => p !== permissionKey),
        { shouldValidate: true },
      );
    }
  };

  const handleGroupToggle = (groupKey: string, checked: boolean) => {
    const group = PERMISSION_GROUPS[groupKey as keyof typeof PERMISSION_GROUPS];
    const currentPermissions = form.getValues("permissions") || [];

    if (checked) {
      const allGroupPermissions = [...currentPermissions];
      group.permissions.forEach((permission) => {
        if (!allGroupPermissions.includes(permission)) {
          allGroupPermissions.push(permission);
        }
      });
      form.setValue("permissions", allGroupPermissions, {
        shouldValidate: true,
      });
    } else {
      form.setValue(
        "permissions",
        currentPermissions.filter(
          (p) => !group.permissions.includes(p as PermissionKey),
        ),
        { shouldValidate: true },
      );
    }
  };

  const isGroupFullySelected = (groupKey: string) => {
    const group = PERMISSION_GROUPS[groupKey as keyof typeof PERMISSION_GROUPS];
    const currentPermissions = form.getValues("permissions") || [];
    return (
      group.permissions.length > 0 &&
      group.permissions.every((permission) =>
        currentPermissions.includes(permission as PermissionKey),
      )
    );
  };

  return (
    <form
      id="add-role-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-2"
      dir="rtl"
    >
      {/* SECTION 1: Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Controller
          name="roleName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-1.5">
              <FieldLabel htmlFor="role-name" className="font-bold text-sm">
                اسم الدور
              </FieldLabel>
              <Input
                {...field}
                id="role-name"
                aria-invalid={fieldState.invalid}
                placeholder="محاسب"
                className={`focus-visible:ring-indigo-500 ${fieldState.invalid ? "border-destructive" : "border-input"}`}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="roleCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-1.5">
              <FieldLabel htmlFor="role-code" className="font-bold text-sm">
                رمز الدور
              </FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger
                  id="role-code"
                  className={`focus-visible:ring-indigo-500 ${fieldState.invalid ? "border-destructive" : "border-input"}`}
                >
                  <SelectValue placeholder="اختر رمز الدور" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ROLE_CODES).map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="space-y-1.5">
            <FieldLabel
              htmlFor="role-description"
              className="font-bold text-sm"
            >
              الوصف
            </FieldLabel>
            <Textarea
              {...field}
              id="role-description"
              aria-invalid={fieldState.invalid}
              placeholder="الوصول إلى جميع الوحدات المحاسبية والمالية"
              className={`resize-none focus-visible:ring-indigo-500 ${fieldState.invalid ? "border-destructive" : "border-input"}`}
              rows={3}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* SECTION 2: Permissions UI */}
      <div className="mt-8 space-y-3">
        {/* تم تثبيت العنوان خارج منطقة السكرول */}
        <h3 className="font-bold text-sm text-foreground">الصلاحيات</h3>

        {/* الصندوق ذو الحدود أصبح هو الذي يحتوي على السكرول */}
        <div className="border rounded-lg bg-background overflow-hidden flex flex-col">
          <ScrollArea className="h-96 w-full py-1">
            <div className="flex flex-col">
              {(
                Object.entries(PERMISSION_GROUPS) as [
                  keyof typeof PERMISSION_GROUPS,
                  PermissionGroup,
                ][]
              ).map(([groupKey, group], index) => {
                const isFullySelected = isGroupFullySelected(groupKey);

                return (
                  <div
                    key={groupKey}
                    className={`p-5 ${index !== 0 ? "border-t border-border" : ""}`}
                  >
                    {/* Group Header Row */}
                    <div className="flex items-center justify-between mb-5">
                      <label
                        htmlFor={`group-${groupKey}`}
                        className="flex items-center gap-3 cursor-pointer group w-max"
                      >
                        <Checkbox
                          id={`group-${groupKey}`}
                          checked={isFullySelected}
                          onCheckedChange={(checked) =>
                            handleGroupToggle(groupKey, checked as boolean)
                          }
                          className={`
                            h-5 w-5 rounded transition-all 
                            ${isFullySelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-input bg-background"}
                          `}
                        />
                        <span className="font-bold text-[15px] text-foreground group-hover:text-indigo-600 transition-colors">
                          {group.title}
                        </span>
                      </label>
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground font-bold text-xs px-2 py-0.5 rounded-md"
                      >
                        {group.permissions.length}
                      </Badge>
                    </div>

                    {/* Permissions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 pl-8">
                      {group.permissions.map((permission: string) => (
                        <Controller
                          key={permission}
                          name="permissions"
                          control={form.control}
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(permission) || false;
                            return (
                              <label
                                htmlFor={permission}
                                className="flex items-center gap-3 cursor-pointer group w-fit"
                              >
                                <Checkbox
                                  id={permission}
                                  checked={isChecked}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(
                                      permission,
                                      checked as boolean,
                                    )
                                  }
                                  className={`
                                    h-[18px] w-[18px] rounded-[4px] transition-all
                                    ${isChecked ? "bg-indigo-600 border-indigo-600 text-white" : "border-input bg-background"}
                                  `}
                                />
                                <span
                                  className={`text-sm font-medium transition-colors ${isChecked ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                                >
                                  {formatPermissionName(permission)}
                                </span>
                              </label>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {form.formState.errors.permissions && (
          <div className="mt-3">
            <FieldError errors={[form.formState.errors.permissions]} />
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex justify-end gap-3 mt-7">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              if (onCancel) onCancel(); // Close dialog on cancel
            }}
            disabled={isLoading}
            className="font-semibold text-foreground border-input"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold min-w-[120px]"
          >
            {isLoading ? "جاري الإنشاء..." : "إنشاء دور"}
          </Button>
        </div>
      )}
    </form>
  );
}
