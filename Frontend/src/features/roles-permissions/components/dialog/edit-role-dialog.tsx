import * as React from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { EditRoleForm, type EditRoleFormData } from "../form/edit-role-form";
import type { RoleCard } from "../../types";

interface EditRoleDialogProps {
  role: RoleCard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleUpdated?: (roleData: EditRoleFormData) => void;
}

export function EditRoleDialog({
  role,
  open,
  onOpenChange,
  onRoleUpdated,
}: EditRoleDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: EditRoleFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback to update your table/state if provided
      if (onRoleUpdated) {
        onRoleUpdated(data);
      }

      toast.success("تم تحديث الدور بنجاح!", {
        description: `تم تحديث الدور ${data.roleName} في النظام.`,
      });

      onOpenChange(false); // Close the dialog on success
    } catch {
      toast.error("فشل في تحديث الدور", {
        description: "حدث خطأ أثناء تحديث الدور. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[95vh] max-md:h-[90vh] p-0 flex flex-col"
        style={{ width: "90vw", maxWidth: "700px" }}
        dir="rtl"
      >
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="text-xl font-bold text-foreground">
            تعديل الدور
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1.5">
            تعديل بيانات الدور وصلاحياته.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 py-1 max-md:h-[calc(90vh-120px)]">
          <div className="pt-2 px-6 pb-6">
            <EditRoleForm
              role={role}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
