import * as React from "react";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";

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

interface ReturnPurchaseDialogProps {
  purchase: Purchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseReturned?: (purchaseId: string) => void;
}

export function ReturnPurchaseDialog({
  purchase,
  open,
  onOpenChange,
  onPurchaseReturned,
}: ReturnPurchaseDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleReturn = async () => {
    if (!purchase) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback if provided
      if (onPurchaseReturned) {
        onPurchaseReturned(purchase.id);
      }

      toast.success("تم إرجاع فاتورة المشتريات بنجاح!", {
        description: `تم إرجاع فاتورة رقم ${purchase.invoiceNumber} وتغيير حالتها إلى مرتجع.`,
      });

      onOpenChange(false);
    } catch {
      toast.error("فشل في إرجاع الفاتورة", {
        description: "حدث خطأ أثناء إرجاع فاتورة المشتريات. يرجى المحاولة مرة أخرى.",
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
            <RotateCcw className="h-5 w-5 text-blue-600" />
            تأكيد الإرجاع
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من أنك تريد إرجاع فاتورة المشتريات رقم{" "}
            <span className="font-semibold">{purchase?.invoiceNumber}</span>؟
            <br />
            <span className="text-blue-600">
              هذا الإجراء سيغير حالة الفاتورة إلى "مرتجع" وستبقى في الجدول.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse justify-start gap-2">
          <AlertDialogCancel disabled={isLoading}>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReturn}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "جاري الإرجاع..." : "تأكيد الإرجاع"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
