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
  onPurchaseCancelled?: (purchaseId: string) => void;
}

export function DeletePurchaseDialog({
  purchase,
  open,
  onOpenChange,
  onPurchaseCancelled,
}: DeletePurchaseDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCancel = async () => {
    if (!purchase) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback if provided
      if (onPurchaseCancelled) {
        onPurchaseCancelled(purchase.id);
      }

      toast.success("تم إلغاء فاتورة المشتريات بنجاح!", {
        description: `تم إلغاء فاتورة رقم ${purchase.invoiceNumber} وتغيير حالتها إلى ملغي.`,
      });

      onOpenChange(false);
    } catch {
      toast.error("فشل في إلغاء الفاتورة", {
        description:
          "حدث خطأ أثناء إلغاء فاتورة المشتريات. يرجى المحاولة مرة أخرى.",
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
            تأكيد الإلغاء
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من أنك تريد إلغاء فاتورة المشتريات رقم{" "}
            <span className="font-semibold">{purchase?.invoiceNumber}</span>؟
            <br />
            <span className="text-destructive">
              هذا الإجراء سيغير حالة الفاتورة إلى "ملغي" وستبقى في الجدول.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse justify-start gap-2">
          <AlertDialogCancel disabled={isLoading}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
