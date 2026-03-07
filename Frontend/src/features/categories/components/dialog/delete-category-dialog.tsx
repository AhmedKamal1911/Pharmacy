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
import { Trash2 } from "lucide-react";
import type { Category } from "../../types";

interface DeleteCategoryDialogProps {
  category: Category;
  children: React.ReactNode;
  onDelete?: (category: Category) => void;
}

export function DeleteCategoryDialog({
  category,
  children,
  onDelete,
}: DeleteCategoryDialogProps) {
  const handleDelete = () => {
    if (category.totalItems === 0) {
      // Delete permanently if no items
      console.log("Deleting category permanently:", category.categoryId);
      // TODO: Call delete API
    } else {
      // Deactivate if has items
      console.log("Deactivating category:", category.categoryId);
      // TODO: Call deactivate API
    }
    
    onDelete?.(category);
  };

  const isPermanentDelete = category.totalItems === 0;
  const title = isPermanentDelete ? "حذف الفئة" : "إلغاء تفعيل الفئة";
  const actionText = isPermanentDelete ? "حذف نهائي" : "إلغاء التفعيل";
  const description = isPermanentDelete
    ? `هل أنت متأكد من حذف فئة "${category.categoryName}" بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.`
    : `فئة "${category.categoryName}" تحتوي على ${category.totalItems} أصناف. سيتم إلغاء تفعيلها بدلاً من حذفها. يمكنك إعادة تفعيلها في أي وقت.`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
