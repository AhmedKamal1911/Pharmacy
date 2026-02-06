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

import type { Customer } from "../../types";
import {
  AddCustomerForm,
  type CustomerFormData,
} from "../form/add-customer-form";

interface AddCustomerDialogProps {
  onCustomerAdded?: (customer: Customer) => void;
  trigger?: React.ReactNode;
}

export function AddCustomerDialog({
  onCustomerAdded,
  trigger,
}: AddCustomerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: CustomerFormData) => {
    setIsLoading(true);

    try {
      // Generate new customer with ID and default values
      const newCustomer: Customer = {
        id: Date.now().toString(), // Simple ID generation
        ...data,
        balance: 0, // New customers start with 0 balance
        lastTransactionAt: new Date().toISOString(),
        loyalty: {
          id: `loyalty-${Date.now()}`,
          pointsPerCurrency: 1,
          totalPoints: 0,
          pendingPoints: 0,
        },
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback if provided
      if (onCustomerAdded) {
        onCustomerAdded(newCustomer);
      }

      toast.success("تم إضافة العميل بنجاح!", {
        description: `تمت إضافة ${newCustomer.name} إلى النظام بنجاح.`,
      });

      setOpen(false);
    } catch {
      toast.error("فشل في إضافة العميل", {
        description: "حدث خطأ أثناء إضافة العميل. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = <Button>إضافة عميل</Button>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>إضافة عميل جديد</DialogTitle>
          <DialogDescription>
            يرجى ملء تفاصيل العميل أدناه لإنشاء حساب عميل جديد.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="pe-4">
            <AddCustomerForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
