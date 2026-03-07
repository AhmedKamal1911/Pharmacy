import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category } from "../../types";
import {
  EditCategoryForm,
  type CategoryFormData,
} from "../form/edit-category-form";

interface EditCategoryDialogProps {
  category: Category;
  children: React.ReactNode;
  onEdit?: (category: Category, data: CategoryFormData) => void;
}

export function EditCategoryDialog({
  category,
  children,
  onEdit,
}: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Call API to update category
      console.log("Updating category:", category.categoryId, data);

      // Show success notification
      toast.success(`تم تحديث فئة "${data.categoryName}" بنجاح`);

      onEdit?.(category, data);
      setOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("حدث خطأ أثناء تحديث الفئة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const initialData: CategoryFormData = {
    categoryName: category.categoryName,
    description: category.description,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="font-semibold">تعديل الفئة</div>
              <div className="text-sm text-gray-500 font-normal">
                {category.categoryId}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-right text-gray-600">
            قم بتعديل بيانات فئة "
            <span className="font-medium text-gray-900">
              {category.categoryName}
            </span>
            ". سيتم تحديث البيانات بعد الحفظ.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-1 mb-4">
            <div className="text-sm font-medium text-gray-700">
              البيانات الحالية:
            </div>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">الاسم:</span>
                <span className="text-sm font-medium">
                  {category.categoryName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">الوصف:</span>
                <span
                  className="text-sm font-medium truncate max-w-48"
                  title={category.description}
                >
                  {category.description}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">الحالة:</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    category.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {category.isActive ? "نشطة" : "غير نشطة"}
                </span>
              </div>
            </div>
          </div>

          <EditCategoryForm
            onSubmit={handleSubmit}
            initialData={initialData}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
