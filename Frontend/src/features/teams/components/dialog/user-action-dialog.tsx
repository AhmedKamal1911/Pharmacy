import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

import {
  AlertTriangle,
  Trash2,
  ShieldOff,
  ShieldAlert,
  UserX,
} from "lucide-react";
import type { User } from "../../types";
import { ROLE_CODES } from "@/data/roles-permissions";
import { ConfirmActionDialog } from "./confirm-action-dialog";

interface UserActionDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeactivate: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
}

export function UserActionDialog({
  user,
  open,
  onOpenChange,
  onDeactivate,
  onDelete,
  isLoading = false,
}: UserActionDialogProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "deactivate" | "delete" | null
  >(null);

  if (!user) return null;

  // Protect Super Admin from being deleted or deactivated
  const isSuperAdmin = user.roles?.some(
    (r) => r.roleId === ROLE_CODES.SUPER_ADMIN,
  );

  const handleDeactivate = () => {
    setPendingAction("deactivate");
    setConfirmDialogOpen(true);
  };

  const handleDelete = () => {
    setPendingAction("delete");
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (pendingAction === "deactivate") {
      onDeactivate(user);
    } else if (pendingAction === "delete") {
      onDelete(user);
    }
    setPendingAction(null);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 overflow-hidden" dir="rtl">
          {/* Header - Styled with a subtle warning background */}
          <div className="bg-destructive/5 pt-6 pb-4 px-6 border-b border-destructive/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2.5 text-xl text-destructive">
                <UserX className="h-6 w-6" />
                إدارة حساب المستخدم
              </DialogTitle>
              <DialogDescription className="text-base mt-2 leading-relaxed">
                اختر الإجراء المطلوب تطبيقه على حساب المستخدم أدناه. يرجى الحذر،
                بعض هذه الإجراءات لا يمكن التراجع عنها.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* User Info Card - Clean and minimal */}
            <div className="bg-muted/40 rounded-xl p-4 border flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-lg mb-0.5">
                  {user.name || "مستخدم بدون اسم"}
                </span>
                <span
                  className="text-sm text-muted-foreground font-mono"
                  dir="ltr"
                >
                  {user.email}
                </span>
              </div>
              <Badge
                variant={user.isActive ? "default" : "secondary"}
                className={
                  user.isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""
                }
              >
                {user.isActive ? "حساب نشط" : "حساب معطل"}
              </Badge>
            </div>

            {isSuperAdmin ? (
              /* Super Admin Protection Notice */
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    حساب محمي (Super Admin)
                  </h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    لا يمكن حذف أو تعطيل حساب مدير النظام الأساسي لضمان استمرار
                    عمل النظام بشكل سليم.
                  </p>
                </div>
              </div>
            ) : (
              /* Action Options */
              <div className="space-y-3">
                {/* Deactivate Option - Styled as a safer warning */}
                <button
                  type="button"
                  onClick={handleDeactivate}
                  disabled={isLoading || !user.isActive}
                  className={`
                    w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-right
                    ${
                      !user.isActive
                        ? "opacity-50 cursor-not-allowed border-muted bg-muted/20"
                        : "border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 cursor-pointer"
                    }
                  `}
                >
                  <div
                    className={`p-2 rounded-full shrink-0 ${!user.isActive ? "bg-muted" : "bg-amber-200/50 text-amber-700"}`}
                  >
                    <ShieldOff className="h-5 w-5" />
                  </div>
                  <div>
                    <h4
                      className={`font-bold mb-1 ${!user.isActive ? "text-muted-foreground" : "text-amber-900"}`}
                    >
                      إيقاف تفعيل الحساب
                    </h4>
                    <p
                      className={`text-sm leading-relaxed ${!user.isActive ? "text-muted-foreground" : "text-amber-700"}`}
                    >
                      لن يتمكن المستخدم من تسجيل الدخول للنظام، ولكن سيتم
                      الاحتفاظ بكافة بياناته وسجلاته السابقة. يمكن إعادة تفعيله
                      لاحقاً.
                    </p>
                  </div>
                </button>

                {/* Delete Option - Explicitly destructive */}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-destructive/20 bg-destructive/5 hover:bg-destructive/10 hover:border-destructive/40 transition-all text-right cursor-pointer group"
                >
                  <div className="p-2 rounded-full shrink-0 bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-white transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-destructive mb-1 flex items-center gap-2">
                      حذف الحساب نهائياً
                      <AlertTriangle className="h-4 w-4" />
                    </h4>
                    <p className="text-sm text-destructive/80 leading-relaxed">
                      هذا الإجراء{" "}
                      <span className="font-bold underline">
                        لا يمكن التراجع عنه
                      </span>
                      . سيتم مسح المستخدم من قاعدة البيانات ولن يظهر في القوائم
                      بعد الآن.
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t flex justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="min-w-[120px] font-medium"
            >
              إلغاء وإغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmActionDialog
        user={user}
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmAction}
        action={pendingAction || "delete"}
        isLoading={isLoading}
      />
    </>
  );
}
