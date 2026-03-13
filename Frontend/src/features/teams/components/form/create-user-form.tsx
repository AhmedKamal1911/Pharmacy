import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Mail, Lock, Shield, User, Info, Phone } from "lucide-react";

import type { CreateUserRequest } from "../../types";
import { ROLES, ROLE_CODES } from "@/data/roles-permissions";

const formSchema = z
  .object({
    name: z.string().optional(),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("البريد الإلكتروني غير صالح"),
    phone: z.string().optional(),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    roleIds: z.array(z.string()).min(1, "يجب اختيار دور واحد على الأقل"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type CreateUserFormData = z.infer<typeof formSchema>;

interface CreateUserFormProps {
  onSubmit: (data: CreateUserRequest) => void;
  isLoading?: boolean;
}

export function CreateUserForm({ onSubmit, isLoading }: CreateUserFormProps) {
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      roleIds: [],
    },
  });

  const handleSubmit = (data: CreateUserFormData) => {
    const submitData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      roleIds: data.roleIds,
    };
    onSubmit(submitData);
  };

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    const currentRoles = form.getValues("roleIds");
    if (checked) {
      form.setValue("roleIds", [...currentRoles, roleId], {
        shouldValidate: true,
      });
    } else {
      form.setValue(
        "roleIds",
        currentRoles.filter((id) => id !== roleId),
        { shouldValidate: true },
      );
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-4"
      dir="rtl"
    >
      {/* SECTION 1: Account Details */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            بيانات الحساب
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            أدخل المعلومات الأساسية للمستخدم الجديد.
          </p>
        </div>

        <div className="grid grid-cols-1  gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="user-name"
                  className="mb-1 text-sm font-semibold"
                >
                  الاسم (اختياري)
                </FieldLabel>
                <Input
                  {...field}
                  id="user-name"
                  placeholder="أدخل اسم المستخدم"
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
                  className="mb-1 text-sm font-semibold"
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
                    className="pl-9 text-left"
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
                  className="mb-1 text-sm font-semibold"
                >
                  رقم الهاتف (اختياري)
                </FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="user-phone"
                    placeholder="+966 50 123 4567"
                    className="pl-9 text-left"
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
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="user-password"
                  className="mb-1 text-sm font-semibold"
                >
                  كلمة المرور <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="user-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 text-left"
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
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="user-confirm-password"
                  className="mb-1 text-sm font-semibold"
                >
                  تأكيد كلمة المرور <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="user-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 text-left"
                    dir="ltr"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      {/* SECTION 2: Roles & Permissions */}
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
              {/* Clean List Layout instead of giant cards */}
              <div className="flex flex-col gap-3">
                {Object.entries(ROLES).map(([roleId, role]) => {
                  if (roleId === ROLE_CODES.SUPER_ADMIN) return null; // Hide super admin

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
                  <Info className="h-4 w-4" />
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

      <Button
        type="submit"
        disabled={isLoading}
        className="min-w-[140px] font-bold"
      >
        {isLoading ? "جاري الإنشاء..." : "إنشاء المستخدم"}
      </Button>
    </form>
  );
}
