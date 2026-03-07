import * as React from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import type { Category } from "../../types";
import {
  AddCategoryForm,
  type CategoryFormData,
} from "../form/add-category-form";

interface AddCategoryDialogProps {
  onCategoryAdded?: (category: Category) => void;
  trigger?: React.ReactNode;
}

export function AddCategoryDialog({
  onCategoryAdded,
  trigger,
}: AddCategoryDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);

    try {
      // Generate new category with ID and default values
      const newCategory: Category = {
        categoryId: `CAT-${Date.now().toString().slice(-3)}`,
        categoryName: data.categoryName,
        description: data.description,
        totalItems: 0,
        items: [],
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback if provided
      if (onCategoryAdded) {
        onCategoryAdded(newCategory);
      }

      toast.success("تم إضافة الفئة بنجاح!", {
        description: `تمت إضافة فئة ${newCategory.categoryName} إلى النظام بنجاح.`,
      });

      setOpen(false);
    } catch {
      toast.error("فشل في إضافة الفئة", {
        description: "حدث خطأ أثناء إضافة الفئة. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = <Button>إنشاء فئة جديدة</Button>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>إنشاء فئة جديدة</DialogTitle>
          <DialogDescription>
            يرجى ملء تفاصيل الفئة أدناه لإنشاء فئة جديدة للأدوية.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="pe-4">
            <AddCategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
