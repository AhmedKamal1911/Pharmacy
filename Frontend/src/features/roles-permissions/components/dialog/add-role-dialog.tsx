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

import { Button } from "@/components/ui/button";
import { AddRoleForm, type RoleFormData } from "../form/add-role-form";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddRoleDialogProps {
  onRoleAdded?: (roleData: RoleFormData) => void;
  trigger?: React.ReactNode;
}

export function AddRoleDialog({ onRoleAdded, trigger }: AddRoleDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: RoleFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback to update your table/state if provided
      if (onRoleAdded) {
        onRoleAdded(data);
      }

      toast.success("تم إنشاء الدور بنجاح!", {
        description: `تم إضافة الدور ${data.roleName} إلى النظام.`,
      });

      setOpen(false); // Close the dialog on success
    } catch {
      toast.error("فشل في إنشاء الدور", {
        description: "حدث خطأ أثناء إنشاء الدور. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
      إضافة دور
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      {/* Set max width to match the screenshot proportions */}
      <DialogContent
        className="max-h-[95vh] max-md:h-[90vh] p-0 flex flex-col"
        style={{ width: "90vw", maxWidth: "700px" }}
        dir="rtl"
      >
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="text-xl font-bold text-foreground">
            إنشاء دور جديد
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1.5">
            إنشاء دور مخصص مع صلاحيات محددة.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 py-1 max-md:h-[calc(90vh-120px)]">
          <div className="pt-2 px-6 pb-6">
            <AddRoleForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onCancel={() => setOpen(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
