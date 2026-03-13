import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Users } from "lucide-react";
import type { RoleCard } from "../../types";

interface DeleteRoleDialogProps {
  role: RoleCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleDeleted?: (role: RoleCard) => void;
}

export function DeleteRoleDialog({
  role,
  open,
  onOpenChange,
  onRoleDeleted,
}: DeleteRoleDialogProps) {
  const handleDelete = () => {
    if (role && onRoleDeleted) {
      onRoleDeleted(role);
    }
    onOpenChange(false);
  };

  const hasUsers = (role?.userCount || 0) > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md" dir="rtl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 text-destructive rounded-full">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <AlertDialogTitle className="text-right">
              حذف الدور
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من حذف دور "{role?.definition.name}"؟
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          {hasUsers ? (
            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Users className="h-4 w-4 text-amber-600" />
              <div className="text-sm text-amber-800">
                <span className="font-semibold">تنبيه:</span> هذا الدور لديه {role?.userCount} مستخدمين. 
                لا يمكن حذف دور لديه مستخدمون.
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-right">
              سيتم حذف هذا الدور بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
            </div>
          )}
        </div>

        <AlertDialogFooter className="flex-row-reverse justify-start gap-2">
          <AlertDialogAction
            onClick={handleDelete}
            disabled={hasUsers}
            className="bg-destructive hover:bg-destructive/90"
          >
            حذف الدور
          </AlertDialogAction>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
