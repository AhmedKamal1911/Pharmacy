import { useState } from "react";
import { MoreHorizontal, Eye, Edit, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Supplier } from "../../types";
import { ViewSupplierDialog } from "../dialog/view-supplier-dialog";
import { EditSupplierDialog } from "../dialog/edit-supplier-dialog";
import { DeleteSupplierDialog } from "../dialog/delete-supplier-dialog";

interface SupplierActionsProps {
  supplier: Supplier;
  onSupplierUpdated?: (supplier: Supplier) => void;
  onSupplierDeleted?: (supplierId: string) => void;
}

export function SupplierActions({
  supplier,
  onSupplierUpdated,
  onSupplierDeleted,
}: SupplierActionsProps) {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
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
          <DropdownMenuItem onClick={() => setViewDialogOpen(true)}>
            <Eye className="ml-2 h-4 w-4" />
            عرض
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="ml-2 h-4 w-4" />
            تعديل
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate(`/purchases?supplierId=${supplier.id}`)}
          >
            <ShoppingCart className="ml-2 h-4 w-4" />
            عرض المشتريات
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="ml-2 h-4 w-4" />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Dialog */}
      <ViewSupplierDialog
        supplier={supplier}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      {/* Edit Dialog */}
      <EditSupplierDialog
        supplier={supplier}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSupplierUpdated={onSupplierUpdated}
      />

      {/* Delete Dialog */}
      <DeleteSupplierDialog
        supplier={supplier}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSupplierDeleted={onSupplierDeleted}
      />
    </>
  );
}
