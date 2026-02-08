import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

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
import type { Supplier } from "../../types";

interface DeleteSupplierDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSupplierDeleted?: (supplierId: string) => void;
}

export function DeleteSupplierDialog({
  supplier,
  open,
  onOpenChange,
  onSupplierDeleted,
}: DeleteSupplierDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!supplier) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback if provided
      if (onSupplierDeleted) {
        onSupplierDeleted(supplier.id);
      }

      toast.success("تم حذف المورد بنجاح!", {
        description: `تم حذف ${supplier.name} من النظام بنجاح.`,
      });

      onOpenChange(false);
    } catch {
      toast.error("فشل في حذف المورد", {
        description: "حدث خطأ أثناء حذف المورد. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            تأكيد الحذف
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من أنك تريد حذف المورد{" "}
            <span className="font-semibold">{supplier?.name}</span>؟
            <br />
            <span className="text-destructive">
              هذا الإجراء لا يمكن التراجع عنه وسيؤدي إلى حذف جميع بيانات المورد.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse justify-start gap-2">
          <AlertDialogCancel disabled={isLoading}>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "جاري الحذف..." : "حذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
