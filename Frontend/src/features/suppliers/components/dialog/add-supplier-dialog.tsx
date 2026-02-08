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

import type { Supplier } from "../../types";
import {
  AddSupplierForm,
  type SupplierFormData,
} from "../form/add-supplier-form";

interface AddSupplierDialogProps {
  onSupplierAdded?: (supplier: Supplier) => void;
  trigger?: React.ReactNode;
}

export function AddSupplierDialog({
  onSupplierAdded,
  trigger,
}: AddSupplierDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: SupplierFormData) => {
    setIsLoading(true);

    try {
      // Generate new supplier with ID and default values
      const newSupplier: Supplier = {
        id: Date.now().toString(), // Simple ID generation
        ...data,
        debitStatus: data.debit > 0 ? "DUE" : "PAID", // Set debit status based on amount
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback if provided
      if (onSupplierAdded) {
        onSupplierAdded(newSupplier);
      }

      toast.success("تم إضافة المورد بنجاح!", {
        description: `تمت إضافة ${newSupplier.name} إلى النظام بنجاح.`,
      });

      setOpen(false);
    } catch {
      toast.error("فشل في إضافة المورد", {
        description: "حدث خطأ أثناء إضافة المورد. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = <Button>إضافة مورد</Button>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>إضافة مورد جديد</DialogTitle>
          <DialogDescription>
            يرجى ملء تفاصيل المورد أدناه لإنشاء حساب مورد جديد.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="pe-4">
            <AddSupplierForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
