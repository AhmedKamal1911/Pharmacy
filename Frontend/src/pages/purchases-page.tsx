import { useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/shared/page-header";
import { PurchasesTable } from "@/features/purchases/components/table/purchases-table";
import { createPurchaseColumns } from "@/features/purchases/components/table/columns";
import { usePurchases } from "@/features/purchases/hooks/use-purchases";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DeletePurchaseDialog } from "@/features/purchases/components/dialog/delete-purchase-dialog";
import { ReturnPurchaseDialog } from "@/features/purchases/components/dialog/return-purchase-dialog";
import type { Purchase, PurchaseReturn } from "@/features/purchases/types";

export default function PurchasesPage() {
  const {
    purchases,
    isLoading,
    isError,
    supplierId,
    cancelPurchase,
    returnPurchaseItems,
  } = usePurchases();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<Purchase | null>(
    null,
  );
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [purchaseToReturn, setPurchaseToReturn] = useState<Purchase | null>(
    null,
  );

  // Handle View Purchase
  const handleViewPurchase = (purchase: Purchase) => {
    navigate(`/purchases/${purchase.id}`);
  };

  // Handle Edit Purchase
  const handleEditPurchase = (purchase: Purchase) => {
    navigate(`/purchases/${purchase.id}/edit`);
  };

  // Handle Delete Purchase
  const handleDeletePurchase = (purchase: Purchase) => {
    setPurchaseToDelete(purchase);
    setDeleteDialogOpen(true);
  };

  // Handle Return Purchase
  const handleReturnPurchase = (purchase: Purchase) => {
    setPurchaseToReturn(purchase);
    setReturnDialogOpen(true);
  };

  // Handle Purchase Returned
  const handlePurchaseReturned = (
    purchaseId: string,
    returnData: PurchaseReturn,
  ) => {
    const success = returnPurchaseItems(purchaseId, returnData);
    if (success) {
      setReturnDialogOpen(false);
      setPurchaseToReturn(null);
    }
    return success;
  };

  // Handle Purchase Cancelled
  const handlePurchaseCancelled = (purchaseId: string) => {
    const success = cancelPurchase(purchaseId);
    if (success) {
      setDeleteDialogOpen(false);
      setPurchaseToDelete(null);
    }
    return success;
  };

  const columns = createPurchaseColumns(
    handleViewPurchase,
    handleEditPurchase,
    handleDeletePurchase,
    handleReturnPurchase,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="المشتريات"
        actions={
          <Button
            onClick={() => navigate("/purchases/new")}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            إضافة فاتورة
          </Button>
        }
      />

      <div className="space-y-4">
        {supplierId ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">مشتريات المورد</h2>
            <div className="text-sm text-muted-foreground">
              Supplier ID: {supplierId}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">
              اختر موردًا لعرض مشترياته
            </h2>
            <p className="text-muted-foreground">
              الرجاء الذهاب إلى صفحة الموردين واختيار مورد لعرض مشترياته
            </p>
          </div>
        )}

        {/* Purchases Table */}
        {isError ? (
          <div className="p-12 border-2 border-dashed rounded-xl text-center">
            <p className="text-destructive">
              حدث خطأ أثناء تحميل بيانات المشتريات. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <PurchasesTable
              columns={columns}
              data={purchases}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Delete Purchase Dialog */}
      <DeletePurchaseDialog
        purchase={purchaseToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onPurchaseCancelled={handlePurchaseCancelled}
      />

      {/* Return Purchase Dialog */}
      <ReturnPurchaseDialog
        purchase={purchaseToReturn}
        open={returnDialogOpen}
        onOpenChange={setReturnDialogOpen}
        onPurchaseReturned={handlePurchaseReturned}
      />
    </div>
  );
}
