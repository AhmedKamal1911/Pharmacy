import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Power } from "lucide-react";
import type { Category } from "../../types";

interface ReactivateCategoryDialogProps {
  category: Category;
  children: React.ReactNode;
  onReactivate?: (category: Category) => void;
}

export function ReactivateCategoryDialog({
  category,
  children,
  onReactivate,
}: ReactivateCategoryDialogProps) {
  const handleReactivate = () => {
    console.log("Reactivating category:", category.categoryId);
    // TODO: Call reactivate API
    onReactivate?.(category);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Power className="h-5 w-5 text-green-600" />
            إعادة تفعيل الفئة
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من إعادة تفعيل فئة "{category.categoryName}"؟
            سيتم تفعيلها مرة أخرى وستظهر في جميع العمليات والبحث.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReactivate}
            className="bg-green-600 hover:bg-green-700"
          >
            إعادة التفعيل
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
