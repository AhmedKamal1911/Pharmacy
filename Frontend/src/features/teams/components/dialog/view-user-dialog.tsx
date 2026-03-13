import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  Calendar,
  Shield,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import type { User } from "../../types";
import { UserStatusBadge, UserRoleBadge } from "../ui/user-badge";
import { ROLE_CODES } from "@/data/roles-permissions";

interface ViewUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserDialog({
  user,
  open,
  onOpenChange,
}: ViewUserDialogProps) {
  if (!user) return null;

  const roles = user.roles?.map((ur) => ur.role.name) || [];
  const status = user.isActive ? "active" : "inactive";

  // Role names in Arabic
  const getRoleDisplayName = (roleName: string) => {
    switch (roleName) {
      case ROLE_CODES.SUPER_ADMIN:
        return "مدير النظام";
      case ROLE_CODES.ADMIN:
        return "مدير";
      case ROLE_CODES.SALES:
        return "موظف مبيعات";
      default:
        return roleName;
    }
  };

  const roleNames = roles.map(getRoleDisplayName);

  // Format dates cleanly
  const createdAt = new Date(user.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updatedAt = new Date(user.updatedAt).toLocaleDateString("ar-EG");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden" dir="rtl">
        <DialogHeader className="sr-only">
          <DialogTitle>تفاصيل المستخدم</DialogTitle>
        </DialogHeader>

        {/* Header Section */}
        <div className="bg-muted/30 pt-8 pb-6 px-6 flex flex-col items-center text-center border-b">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-background shadow-sm">
            <UserIcon className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            {user.name || "مستخدم بدون اسم"}
          </h2>
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span dir="ltr">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
          <UserStatusBadge status={status} />
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Roles Section */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              الأدوار والصلاحيات
            </h4>
            <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
              <UserRoleBadge roles={roleNames} maxDisplay={10} />
            </div>
          </div>

          {/* Details Grid */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              سجل الحساب
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted/40 p-3 rounded-lg border border-border/50 flex flex-col gap-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  تاريخ الإنشاء
                </span>
                <span className="text-sm font-medium text-foreground">
                  {createdAt}
                </span>
              </div>
              <div className="bg-muted/40 p-3 rounded-lg border border-border/50 flex flex-col gap-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  آخر تحديث
                </span>
                <span className="text-sm font-medium text-foreground">
                  {updatedAt}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="px-6 py-4 bg-muted/20 border-t flex justify-end mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="min-w-[120px]"
          >
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
