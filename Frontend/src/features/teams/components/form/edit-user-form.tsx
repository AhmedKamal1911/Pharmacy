import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
  Mail,
  Shield,
  User as UserIcon,
  Info,
  Phone,
  ToggleLeft,
  ShieldAlert,
} from "lucide-react";

import type { User } from "../../types";
import { ROLES, ROLE_CODES } from "@/data/roles-permissions";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صالح"),
  phone: z.string().optional(),
  isActive: z.boolean(),
  roleIds: z.array(z.string()).min(1, "يجب اختيار دور واحد أو أكثر"),
});

export type EditUserFormData = z.infer<typeof formSchema>;

interface EditUserFormProps {
  initialData?: EditUserFormData;
  onSubmit: (data: EditUserFormData) => void;
  isLoading?: boolean;
  currentUser?: User; // Current logged-in user context
}

export function EditUserForm({
  initialData,
  onSubmit,
  isLoading,
  currentUser,
}: EditUserFormProps) {
  // التحقق: هل المستخدم الجاري تعديله هو Super Admin؟
  const isEditingSuperAdmin = initialData?.roleIds?.includes(
    ROLE_CODES.SUPER_ADMIN,
  );

  // التحقق: هل المستخدم يحاول تعديل نفسه؟
  const isEditingSelf = currentUser && initialData?.email === currentUser.email;

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      // تثبيت الحالة كنشط دائماً للسوبر أدمن
      isActive: isEditingSuperAdmin ? true : (initialData?.isActive ?? true),
      // تثبيت الدور كـ سوبر أدمن فقط
      roleIds: isEditingSuperAdmin
        ? [ROLE_CODES.SUPER_ADMIN]
        : initialData?.roleIds || [],
    },
  });

  const handleSubmit = (data: EditUserFormData) => {
    if (isEditingSuperAdmin) {
      // إرسال البيانات الأساسية فقط وتثبيت الصلاحيات للحماية
      onSubmit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        isActive: true,
        roleIds: [ROLE_CODES.SUPER_ADMIN],
      });
    } else if (isEditingSelf) {
      // Self-modification protection: Cannot deactivate own account or remove own access
      const currentUserRoles = currentUser?.roles.map((r) => r.roleId) || [];
      const newRoles = data.roleIds;

      // Check if user is trying to remove their own admin access
      const hadAdminAccess =
        currentUserRoles.includes(ROLE_CODES.ADMIN) ||
        currentUserRoles.includes(ROLE_CODES.SUPER_ADMIN);
      const willHaveAdminAccess = newRoles.includes(ROLE_CODES.ADMIN);

      if (hadAdminAccess && !willHaveAdminAccess) {
        // In a real app, this would show an error. For now, we'll prevent the action.
        onSubmit({
          name: data.name,
          email: data.email,
          phone: data.phone,
          isActive: true, // Cannot deactivate self
          roleIds: currentUserRoles, // Keep current roles
        });
      } else {
        onSubmit({
          name: data.name,
          email: data.email,
          phone: data.phone,
          isActive: true, // Cannot deactivate self
          roleIds: data.roleIds,
        });
      }
    } else {
      onSubmit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        isActive: data.isActive,
        roleIds: data.roleIds,
      });
    }
  };

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (isEditingSuperAdmin) return; // حماية إضافية

    const currentRoles = form.getValues("roleIds");

    if (checked) {
      // Allow multiple roles selection
      const updatedRoles = currentRoles.includes(roleId)
        ? currentRoles
        : [...currentRoles, roleId];

      form.setValue("roleIds", updatedRoles, {
        shouldValidate: true,
      });
    } else {
      // Allow unchecking (will show validation error if no roles selected)
      const updatedRoles = currentRoles.filter((r) => r !== roleId);
      form.setValue("roleIds", updatedRoles, {
        shouldValidate: true,
      });
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6"
      dir="rtl"
    >
      {/* رسالة تنبيه السوبر أدمن */}
      {isEditingSuperAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900">
              حساب مدير النظام (Super Admin)
            </h3>
            <p className="text-sm text-blue-700 mt-1 leading-relaxed">
              هذا الحساب يمتلك صلاحيات مطلقة على النظام. لا يمكن تعديل صلاحياته
              أو إيقاف تفعيله لضمان استمرار عمل النظام. يمكنك فقط تحديث بياناته
              الشخصية.
            </p>
          </div>
        </div>
      )}

      {/* رسالة تنبيه تعديل النفس */}
      {isEditingSelf && !isEditingSuperAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-900">
              تعديل بياناتك الشخصية
            </h3>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
              أنت تقوم بتعديل بيانات حسابك الخاص. كن حذرًا عند تغيير صلاحياتك أو
              حالة حسابك حيث قد يؤثر على قدرتك على الوصول إلى النظام.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 1: Account Details */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            بيانات الحساب
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            قم بتحديث المعلومات الأساسية للمستخدم.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="user-name"
                  className="mb-1.5 text-sm font-semibold"
                >
                  الاسم (اختياري)
                </FieldLabel>
                <Input
                  {...field}
                  id="user-name"
                  placeholder="أدخل اسم المستخدم"
                  className="bg-background"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="user-email"
                  className="mb-1.5 text-sm font-semibold"
                >
                  البريد الإلكتروني <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="user-email"
                    type="email"
                    placeholder="example@email.com"
                    className="pl-9 text-left bg-background"
                    dir="ltr"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="user-phone"
                  className="mb-1.5 text-sm font-semibold"
                >
                  رقم الهاتف (اختياري)
                </FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="user-phone"
                    placeholder="+966 50 123 4567"
                    className="pl-9 text-left bg-background"
                    dir="ltr"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* إخفاء حالة الحساب للسوبر أدمن وللتعديل الذاتي */}
          {!isEditingSuperAdmin && !isEditingSelf && (
            <div className="pt-2">
              <Controller
                name="isActive"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                      <div className="flex items-center gap-3">
                        <ToggleLeft className="h-5 w-5 text-primary" />
                        <div>
                          <FieldLabel className="text-sm font-semibold mb-0.5">
                            حالة المستخدم
                          </FieldLabel>
                          <p className="text-xs text-muted-foreground">
                            {field.value
                              ? "المستخدم نشط ويمكنه تسجيل الدخول"
                              : "المستخدم غير نشط ولا يمكنه تسجيل الدخول"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        dir="rtl"
                      />
                    </div>
                  </Field>
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Roles & Permissions (إخفاء كامل للسوبر أدمن وللتعديل الذاتي للأدمن) */}
      {!isEditingSuperAdmin &&
        !(
          isEditingSelf &&
          currentUser?.roles.some((r) => r.roleId === ROLE_CODES.ADMIN)
        ) && (
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="mb-6 border-b pb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                الصلاحيات والأدوار{" "}
                <span className="text-destructive text-sm">*</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                حدد مستوى الوصول المسموح به لهذا المستخدم.
              </p>
            </div>

            <Controller
              name="roleIds"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex flex-col gap-3">
                    {Object.entries(ROLES).map(([roleId, role]) => {
                      // إخفاء خيار السوبر أدمن من القائمة المتاحة للاختيار
                      if (roleId === ROLE_CODES.SUPER_ADMIN) return null;

                      const isSelected = field.value.includes(roleId);

                      return (
                        <label
                          key={roleId}
                          htmlFor={`role-${roleId}`}
                          className={`
                          flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer
                          hover:bg-accent/50
                          ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-background"}
                        `}
                        >
                          <div className="mt-1">
                            <Checkbox
                              id={`role-${roleId}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleRoleToggle(roleId, checked as boolean)
                              }
                              className="data-[state=checked]:bg-primary"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`font-semibold text-base ${isSelected ? "text-primary" : "text-foreground"}`}
                              >
                                {role.name}
                              </span>
                              {isSelected && (
                                <Badge
                                  variant="default"
                                  className="text-xs font-normal"
                                >
                                  تم التحديد
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {role.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {fieldState.invalid && (
                    <div className="mt-4 flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                      <Info className="h-4 w-4 shrink-0" />
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-sm font-medium"
                      />
                    </div>
                  )}
                </Field>
              )}
            />
          </div>
        )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => form.reset()}
          disabled={isLoading}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[140px] font-bold"
        >
          {isLoading ? "جاري التحديث..." : "تحديث المستخدم"}
        </Button>
      </div>
    </form>
  );
}
