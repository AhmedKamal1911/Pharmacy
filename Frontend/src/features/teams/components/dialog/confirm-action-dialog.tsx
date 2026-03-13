import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { AlertTriangle, ShieldOff } from "lucide-react";
import type { User } from "../../types";

interface ConfirmActionDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  action: "deactivate" | "delete";
  isLoading?: boolean;
}

export function ConfirmActionDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  action,
  isLoading = false,
}: ConfirmActionDialogProps) {
  if (!user) return null;

  const isDeactivate = action === "deactivate";
  const isDelete = action === "delete";

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" p-0 overflow-hidden" dir="rtl">
        {/* Header - Compact danger styling */}
        <div
          className={`
          pt-4 pb-3 px-4 border-b text-center
          ${isDelete ? "bg-destructive/10 border-destructive/20" : "bg-amber-50 border-amber-200"}
        `}
        >
          <div className="flex justify-center mb-2">
            <div
              className={`
              p-2 rounded-full
              ${isDelete ? "bg-destructive/20 text-destructive" : "bg-amber-200 text-amber-700"}
            `}
            >
              {isDelete ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <ShieldOff className="h-5 w-5" />
              )}
            </div>
          </div>
          <DialogTitle
            className={`
            text-lg font-bold
            ${isDelete ? "text-destructive" : "text-amber-800"}
          `}
          >
            {isDelete ? "تأكيد الحذف النهائي" : "تأكيد إيقاف التفعيل"}
          </DialogTitle>
        </div>

        <div className="px-4 py-4 space-y-3">
          {/* User Info - Compact */}
          <div className="text-center">
            <p className="font-semibold text-foreground">
              {user.name || "مستخدم بدون اسم"}
            </p>
            <p className="text-sm text-muted-foreground font-mono" dir="ltr">
              {user.email}
            </p>
            <Badge
              variant={user.isActive ? "default" : "secondary"}
              className={`mt-2 ${user.isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
            >
              {user.isActive ? "حساب نشط" : "حساب معطل"}
            </Badge>
          </div>

          {/* Warning Message - Compact */}
          <div
            className={`
            rounded-lg p-3 text-center text-sm
            ${isDelete ? "bg-destructive/5 border border-destructive/20 text-destructive/90" : "bg-amber-50 border border-amber-200 text-amber-800"}
          `}
          >
            {isDelete ? (
              <>
                <p className="font-semibold mb-1">
                  ⚠️ حذف نهائي لا يمكن التراجع عنه
                </p>
                <p>سيتم مسح جميع بيانات المستخدم بشكل دائم</p>
              </>
            ) : (
              <>
                <p className="font-semibold mb-1">🔒 إيقاف تفعيل الحساب</p>
                <p>
                  لن يتمكن المستخدم من تسجيل الدخول ولكن تبقى البيانات محفوظة
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions - Compact */}
        <div className="px-4 py-3 bg-muted/30 border-t flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 text-sm h-9"
          >
            إلغاء
          </Button>
          <Button
            variant={isDelete ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
            className={`
              flex-1 text-sm h-9
              ${isDeactivate ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}
            `}
          >
            {isDelete ? "حذف نهائياً" : "إيقاف التفعيل"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
