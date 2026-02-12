import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Purchase } from "../../types";

interface PurchaseActionsProps {
  purchase: Purchase;
  onView?: (purchase: Purchase) => void;
  onEdit?: (purchase: Purchase) => void;
  onDelete?: (purchase: Purchase) => void;
}

export function PurchaseActions({
  purchase,
  onView,
  onEdit,
  onDelete,
}: PurchaseActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">فتح القائمة</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onView?.(purchase)}>
          <Eye className="ml-2 h-4 w-4" />
          عرض
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(purchase)}>
          <Edit className="ml-2 h-4 w-4" />
          تعديل
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete?.(purchase)}
          className="text-red-600"
        >
          <Trash2 className="ml-2 h-4 w-4" />
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
