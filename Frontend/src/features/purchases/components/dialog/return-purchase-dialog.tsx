import * as React from "react";
import { toast } from "sonner";
import {
  RotateCcw,
  CheckSquare,
  Square,
  Package,
  Calculator,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type {
  Purchase,
  PurchaseInvoice,
  PurchaseReturn,
  ReturnItem,
} from "../../types";

interface ReturnPurchaseDialogProps {
  purchase: Purchase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseReturned?: (purchaseId: string, returnData: PurchaseReturn) => void;
}

export function ReturnPurchaseDialog({
  purchase,
  open,
  onOpenChange,
  onPurchaseReturned,
}: ReturnPurchaseDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(
    new Set(),
  );
  const [returnQuantities, setReturnQuantities] = React.useState<
    Record<string, number>
  >({});
  const [returnReasons, setReturnReasons] = React.useState<
    Record<string, string>
  >({});
  const [selectAll, setSelectAll] = React.useState(false);

  // Mock invoice data - in real app, this would come from API
  const [invoiceData, setInvoiceData] = React.useState<PurchaseInvoice | null>(
    null,
  );

  React.useEffect(() => {
    if (purchase && open) {
      // Reset state when dialog opens
      setSelectedItems(new Set());
      setReturnQuantities({});
      setReturnReasons({});
      setSelectAll(false);

      // Mock fetching invoice details
      // In real app, this would be an API call
      import("../../api/mock-data").then(({ getPurchaseInvoiceById }) => {
        const invoice = getPurchaseInvoiceById(purchase.id);
        setInvoiceData(invoice);
      });
    }
  }, [purchase, open]);

  const handleToggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
      const newQuantities = { ...returnQuantities };
      const newReasons = { ...returnReasons };
      delete newQuantities[itemId];
      delete newReasons[itemId];
      setReturnQuantities(newQuantities);
      setReturnReasons(newReasons);
    } else {
      newSelected.add(itemId);
      const item = invoiceData?.items.find((i) => i.id === itemId);
      if (item) {
        setReturnQuantities((prev) => ({ ...prev, [itemId]: item.quantity }));
      }
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === invoiceData?.items.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
      setReturnQuantities({});
      setReturnReasons({});
    } else {
      const allItemIds = invoiceData?.items.map((item) => item.id) || [];
      setSelectedItems(new Set(allItemIds));
      const quantities: Record<string, number> = {};
      const reasons: Record<string, string> = {};
      invoiceData?.items.forEach((item) => {
        quantities[item.id] = item.quantity;
      });
      setReturnQuantities(quantities);
      setReturnReasons(reasons);
    }
    setSelectAll(!selectAll);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = invoiceData?.items.find((i) => i.id === itemId);
    if (item && quantity > 0 && quantity <= item.quantity) {
      setReturnQuantities((prev) => ({ ...prev, [itemId]: quantity }));
    }
  };

  const handleReasonChange = (itemId: string, reason: string) => {
    setReturnReasons((prev) => ({ ...prev, [itemId]: reason }));
  };

  const calculateTotalRefund = () => {
    if (!invoiceData) return 0;

    let total = 0;
    selectedItems.forEach((itemId) => {
      const item = invoiceData.items.find((i) => i.id === itemId);
      const quantity = returnQuantities[itemId] || 0;
      if (item) {
        const itemTotal = item.cost * quantity;
        total += itemTotal;
      }
    });

    return total;
  };

  const getReturnType = (): "FULL" | "PARTIAL" => {
    if (!invoiceData) return "PARTIAL";

    const allItemsSelected = selectedItems.size === invoiceData.items.length;
    const allQuantitiesMatch = invoiceData.items.every(
      (item) =>
        selectedItems.has(item.id) &&
        returnQuantities[item.id] === item.quantity,
    );

    return allItemsSelected && allQuantitiesMatch ? "FULL" : "PARTIAL";
  };

  const handleReturn = async () => {
    if (!purchase || !invoiceData || selectedItems.size === 0) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Prepare return data
      const returnItems: ReturnItem[] = Array.from(selectedItems).map(
        (itemId) => ({
          itemId,
          quantity: returnQuantities[itemId] || 0,
          reason: returnReasons[itemId] || "",
        }),
      );

      const returnData: PurchaseReturn = {
        purchaseId: purchase.id,
        returnDate: new Date().toISOString(),
        items: returnItems,
        returnType: getReturnType(),
        totalRefund: calculateTotalRefund(),
      };

      // Call the callback if provided
      if (onPurchaseReturned) {
        onPurchaseReturned(purchase.id, returnData);
      }

      const returnTypeText =
        getReturnType() === "FULL" ? "مرتجع كامل" : "مرتجع جزئي";
      toast.success("تم إرجاع فاتورة المشتريات بنجاح!", {
        description: `تم إرجاع فاتورة رقم ${purchase.invoiceNumber} وتغيير حالتها إلى ${returnTypeText}.`,
      });

      onOpenChange(false);
    } catch {
      toast.error("فشل في إرجاع الفاتورة", {
        description:
          "حدث خطأ أثناء إرجاع فاتورة المشتريات. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isReturnDisabled = selectedItems.size === 0 || isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="pt-5">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <RotateCcw className="h-5 w-5 text-blue-600" />
            إرجاع فاتورة المشتريات
          </DialogTitle>
          <DialogDescription className="text-right">
            فاتورة رقم:{" "}
            <span className="font-semibold">{purchase?.invoiceNumber}</span> |
            المورد:{" "}
            <span className="font-semibold">{purchase?.supplierName}</span> |
            التاريخ:{" "}
            <span className="font-semibold">
              {purchase &&
                format(new Date(purchase.invoiceDate), "dd MMMM yyyy", {
                  locale: ar,
                })}
            </span>
          </DialogDescription>
        </DialogHeader>

        {invoiceData ? (
          <div className="space-y-4">
            {/* Select All Option */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="flex items-center gap-2"
                    >
                      {selectAll ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                      تحديد كل الأصناف
                    </Button>
                    <Badge variant={selectAll ? "default" : "secondary"}>
                      {selectAll ? "مرتجع كامل" : "مرتجع جزئي"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    {selectedItems.size} من {invoiceData.items.length} أصناف
                    مختارة
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items List */}
            <ScrollArea className="h-96 border rounded-lg">
              <div className="p-4 space-y-4">
                {invoiceData.items.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  const returnQuantity = returnQuantities[item.id] || 0;
                  const itemRefund = isSelected
                    ? item.cost * returnQuantity
                    : 0;

                  return (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all p-3 px-0 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleToggleItem(item.id)}
                    >
                      <CardContent className="px-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  {item.medicineName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  الكود: {item.medicineCode} | الكمية المتاحة:{" "}
                                  {item.quantity}
                                </p>
                              </div>
                              <div className="text-left">
                                <p className="text-sm text-muted-foreground">
                                  سعر التكلفة
                                </p>
                                <p className="font-semibold">
                                  {item.cost.toFixed(2)} ج.م
                                </p>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="space-y-4 pt-4 border-t bg-white rounded-lg p-4">
                                {/* Return Quantity Section */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Package className="h-4 w-4 text-blue-600" />
                                    <Label className="text-sm font-medium">
                                      الكمية المرتجعة
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">
                                      من {item.quantity} متاحة
                                    </span>
                                    <Input
                                      id={`quantity-${item.id}`}
                                      type="number"
                                      min="1"
                                      max={item.quantity}
                                      value={returnQuantity}
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          item.id,
                                          parseInt(e.target.value) || 0,
                                        )
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-24 text-center"
                                    />
                                  </div>
                                </div>

                                {/* Return Reason Section */}
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`reason-${item.id}`}
                                    className="text-sm font-medium flex items-center gap-2"
                                  >
                                    سبب الإرجاع
                                    <span className="text-xs text-muted-foreground font-normal">
                                      (اختياري)
                                    </span>
                                  </Label>
                                  <Input
                                    id={`reason-${item.id}`}
                                    placeholder="أدخل سبب الإرجاع..."
                                    value={returnReasons[item.id] || ""}
                                    onChange={(e) =>
                                      handleReasonChange(
                                        item.id,
                                        e.target.value,
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-right"
                                  />
                                </div>

                                {/* Return Value Section */}
                                <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                                  <div className="flex items-center gap-2">
                                    <Calculator className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">
                                      قيمة الإرجاع
                                    </span>
                                  </div>
                                  <div className="text-left">
                                    <span className="text-lg font-bold text-green-600">
                                      {itemRefund.toFixed(2)} ج.م
                                    </span>
                                    <div className="text-xs text-muted-foreground">
                                      {item.cost.toFixed(2)} × {returnQuantity}
                                    </div>
                                  </div>
                                </div>

                                {/* Remaining Quantity Info */}
                                {returnQuantity < item.quantity && (
                                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                    <span className="text-sm text-blue-700">
                                      سيتبقى {item.quantity - returnQuantity} من
                                      هذا الصنف في المخزون
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Summary */}
            <Separator />
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">ملخص الإرجاع</h4>
                    <p className="text-sm text-muted-foreground">
                      نوع الإرجاع:{" "}
                      <span className="font-medium">
                        {getReturnType() === "FULL"
                          ? "مرتجع كامل"
                          : "مرتجع جزئي"}
                      </span>
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">
                      إجمالي المبلغ المسترد
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {calculateTotalRefund().toFixed(2)} ج.م
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              جاري تحميل بيانات الفاتورة...
            </p>
          </div>
        )}

        <DialogFooter className="flex-row-reverse justify-start gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleReturn}
            disabled={isReturnDisabled}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "جاري الإرجاع..." : "تأكيد الإرجاع"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
