import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MedicineDetailsDialog } from "../dialog/medicine-details-dialog";
import { EditMedicineDialog } from "../dialog/edit-medicine-dialog";
import { DeleteMedicineDialog } from "../dialog/delete-medicine-dialog";
import { useState } from "react";

import type { Medicine } from "../../types";

interface MedicineActionsProps {
  medicine: Medicine;
  onView?: (medicine: Medicine) => void;
  onEdit?: (medicine: Medicine) => void;
  onDelete?: (medicineId: string, variantIds?: string[]) => void;
}

export function MedicineActions({
  medicine,
  onView,
  onEdit,
  onDelete,
}: MedicineActionsProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = (updatedMedicine: Medicine) => {
    if (onEdit) {
      onEdit(updatedMedicine);
    }
  };

  const handleDelete = (medicineId: string, variantIds?: string[]) => {
    if (onDelete) {
      onDelete(medicineId, variantIds);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">فتح القائمة</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {onView && (
            <>
              <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
                <Eye className="ms-2 h-4 w-4" />
                عرض
              </DropdownMenuItem>
            </>
          )}
          {onEdit && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Edit className="ms-2 h-4 w-4" />
                تعديل
              </DropdownMenuItem>
            </>
          )}
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-red-600"
              >
                <Trash2 className="ms-2 h-4 w-4" />
                حذف
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <MedicineDetailsDialog
        medicine={medicine}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
      <EditMedicineDialog
        medicine={medicine}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEdit}
      />
      <DeleteMedicineDialog
        medicine={medicine}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
