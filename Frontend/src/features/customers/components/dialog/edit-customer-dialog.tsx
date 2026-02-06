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

import {
  EditCustomerForm,
  type EditCustomerFormData,
} from "../form/edit-customer-form";
import type { Customer } from "../../types";

interface EditCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerUpdated?: (customer: Customer) => void;
}

export function EditCustomerDialog({
  customer,
  open,
  onOpenChange,
  onCustomerUpdated,
}: EditCustomerDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: EditCustomerFormData) => {
    if (!customer) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create updated customer object
      const updatedCustomer: Customer = {
        ...customer,
        ...data,
      };

      // Call the callback if provided
      if (onCustomerUpdated) {
        onCustomerUpdated(updatedCustomer);
      }

      toast.success("تم تحديث العميل بنجاح!", {
        description: `تم تحديث بيانات ${updatedCustomer.name} بنجاح.`,
      });

      onOpenChange(false);
    } catch {
      toast.error("فشل في تحديث العميل", {
        description: "حدث خطأ أثناء تحديث العميل. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert customer data to form format
  const defaultValues = customer
    ? {
        name: customer.name,
        phone: customer.phone || "",
        address: customer.address || "",
        type: customer.type,
        isCashOnly: customer.isCashOnly,
        balance: customer.balance,
        creditLimit: customer.creditLimit,
        localDiscount: customer.localDiscount,
        importDiscount: customer.importDiscount,
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات العميل</DialogTitle>
          <DialogDescription>
            يرجى تعديل بيانات العميل أدناه وتحديث المعلومات المطلوبة.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="pe-4">
            {customer && (
              <EditCustomerForm
                initialData={defaultValues}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
