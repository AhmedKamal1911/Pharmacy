import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import type { Supplier, SupplierType, SupplierDebitStatus } from "../../types";

interface ViewSupplierDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const getSupplierTypeLabel = (type: SupplierType): string => {
  switch (type) {
    case "WAREHOUSE":
      return "مخزن";
    case "COMPANY":
      return "شركة";
    case "PERSON":
      return "فرد";
    default:
      return type;
  }
};

const getDebitStatusLabel = (status?: SupplierDebitStatus): string => {
  switch (status) {
    case "PAID":
      return "مدفوع";
    case "DUE":
      return "مستحق";
    case "OVERDUE":
      return "متأخر";
    default:
      return "غير محدد";
  }
};

const getDebitStatusVariant = (
  status?: SupplierDebitStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "PAID":
      return "default";
    case "DUE":
      return "secondary";
    case "OVERDUE":
      return "destructive";
    default:
      return "outline";
  }
};

export function ViewSupplierDialog({
  supplier,
  open,
  onOpenChange,
  trigger,
}: ViewSupplierDialogProps) {
  if (!supplier) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>تفاصيل المورد</DialogTitle>
          <DialogDescription>
            عرض جميع معلومات المورد {supplier.name}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">المعلومات الأساسية</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    الاختصار
                  </Label>
                  <p className="text-base font-mono font-medium bg-muted px-2 py-1 rounded inline-block">
                    {supplier.short}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    اسم المورد
                  </Label>
                  <p className="text-base font-medium">{supplier.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    النوع
                  </Label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {getSupplierTypeLabel(supplier.supplierType)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">معلومات الاتصال</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    رقم المحمول
                  </Label>
                  <p className="text-base">{supplier.mobilePhone}</p>
                </div>
                {supplier.landlinePhone && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      رقم الأرضي
                    </Label>
                    <p className="text-base">{supplier.landlinePhone}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">المعلومات المالية</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    المديونية
                  </Label>
                  <p className="text-base font-medium">
                    {supplier.debit.toFixed(2)} ريال
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    حالة المديونية
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={getDebitStatusVariant(supplier.debitStatus)}
                    >
                      {getDebitStatusLabel(supplier.debitStatus)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    فترة الأجل
                  </Label>
                  <p className="text-base">
                    {supplier.paymentPeriodMonths} شهر
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Dates Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">التواريخ</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    تاريخ الإنشاء
                  </Label>
                  <p className="text-base">{formatDate(supplier.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    آخر تحديث
                  </Label>
                  <p className="text-base">{formatDate(supplier.updatedAt)}</p>
                </div>
              </div>
              {supplier.settlementDate && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    تاريخ التقفيل
                  </Label>
                  <p className="text-base">
                    {formatDate(supplier.settlementDate)}
                  </p>
                </div>
              )}
              {supplier.checksDueDate && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    تاريخ سداد الشيكات
                  </Label>
                  <p className="text-base">
                    {formatDate(supplier.checksDueDate)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
