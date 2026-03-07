import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Power } from "lucide-react";
import { DeleteCategoryDialog } from "../dialog/delete-category-dialog";
import { ReactivateCategoryDialog } from "../dialog/reactivate-category-dialog";
import { EditCategoryDialog } from "../dialog/edit-category-dialog";
import { CategoryDetailsDialog } from "../dialog/category-details-dialog";
import { useState } from "react";
import type { Category } from "../../types";

export const ActionsCell = ({ category }: { category: Category }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <div className="text-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="text-blue-600"
              onClick={() => setIsDetailsOpen(true)}
            >
              <Eye className="ml-2 h-4 w-4" />
              عرض التفاصيل
            </DropdownMenuItem>
            <EditCategoryDialog category={category}>
              <DropdownMenuItem
                className="text-blue-600"
                onSelect={(e) => e.preventDefault()}
              >
                <Edit className="ml-2 h-4 w-4" />
                تعديل الفئة
              </DropdownMenuItem>
            </EditCategoryDialog>
            {!category.isActive && (
              <ReactivateCategoryDialog category={category}>
                <DropdownMenuItem
                  className="text-green-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Power className="ml-2 h-4 w-4" />
                  إعادة تفعيل الفئة
                </DropdownMenuItem>
              </ReactivateCategoryDialog>
            )}
            <DropdownMenuSeparator />
            <DeleteCategoryDialog category={category}>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حذف الفئة
              </DropdownMenuItem>
            </DeleteCategoryDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CategoryDetailsDialog
        category={category}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  );
};
