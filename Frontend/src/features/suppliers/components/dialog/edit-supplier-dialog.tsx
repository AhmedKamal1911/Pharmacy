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

import type { Supplier } from "../../types";
import {
  EditSupplierForm,
  type SupplierFormData,
} from "../form/edit-supplier-form";

interface EditSupplierDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSupplierUpdated?: (supplier: Supplier) => void;
}

export function EditSupplierDialog({
  supplier,
  open,
  onOpenChange,
  onSupplierUpdated,
}: EditSupplierDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: SupplierFormData) => {
    if (!supplier) return;

    setIsLoading(true);

    try {
      // Update supplier with new data
      const updatedSupplier: Supplier = {
        ...supplier,
        ...data,
        debitStatus: data.debit > 0 ? "DUE" : "PAID", // Update debit status based on amount
        updatedAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback if provided
      if (onSupplierUpdated) {
        onSupplierUpdated(updatedSupplier);
      }

      toast.success("تم تحديث المورد بنجاح!", {
        description: `تم تحديث بيانات ${updatedSupplier.name} بنجاح.`,
      });

      onOpenChange(false);
    } catch {
      toast.error("فشل في تحديث المورد", {
        description: "حدث خطأ أثناء تحديث المورد. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initialData = supplier
    ? {
        name: supplier.name,
        supplierType: supplier.supplierType,
        debit: supplier.debit,
        paymentPeriodMonths: supplier.paymentPeriodMonths,
        landlinePhone: supplier.landlinePhone || "",
        mobilePhone: supplier.mobilePhone,
      }
    : {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>تحديث بيانات المورد</DialogTitle>
          <DialogDescription>
            يرجى تعديل تفاصيل المورد أدناه لتحديث بياناته.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="pe-4">
            <EditSupplierForm
              onSubmit={handleSubmit}
              initialData={initialData}
              isLoading={isLoading}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
