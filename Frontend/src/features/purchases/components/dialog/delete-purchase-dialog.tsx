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
import type { Purchase } from "../../types";

interface DeletePurchaseDialogProps {
  purchase: Purchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseDeleted?: (purchaseId: string) => void;
}

export function DeletePurchaseDialog({
  purchase,
  open,
  onOpenChange,
  onPurchaseDeleted,
}: DeletePurchaseDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!purchase) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback if provided
      if (onPurchaseDeleted) {
        onPurchaseDeleted(purchase.id);
      }

      toast.success("تم حذف فاتورة المشتريات بنجاح!", {
        description: `تم حذف فاتورة رقم ${purchase.invoiceNumber} من النظام بنجاح.`,
      });

      onOpenChange(false);
    } catch {
      toast.error("فشل في حذف الفاتورة", {
        description: "حدث خطأ أثناء حذف فاتورة المشتريات. يرجى المحاولة مرة أخرى.",
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
            هل أنت متأكد من أنك تريد حذف فاتورة المشتريات رقم{" "}
            <span className="font-semibold">{purchase?.invoiceNumber}</span>؟
            <br />
            <span className="text-destructive">
              هذا الإجراء لا يمكن التراجع عنه وسيؤدي إلى حذف جميع بيانات الفاتورة.
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
