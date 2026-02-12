import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PageHeader } from "@/components/shared/page-header";
import { PurchasesTable } from "@/features/purchases/components/table/purchases-table";
import { createPurchaseColumns } from "@/features/purchases/components/table/columns";
import { usePurchases } from "@/features/purchases/hooks/use-purchases";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DeletePurchaseDialog } from "@/features/purchases/components/dialog/delete-purchase-dialog";
import type { Purchase } from "@/features/purchases/types";

export default function SupplierPurchasesPage() {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();
  const { purchases, isLoading, isError, deletePurchase } =
    usePurchases(supplierId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<Purchase | null>(
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

  // Handle Purchase Deleted
  const handlePurchaseDeleted = (purchaseId: string) => {
    const success = deletePurchase(purchaseId);
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
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="مشتريات المورد"
        actions={
          <Button
            onClick={() => navigate(`/purchases/new?supplier=${supplierId}`)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            إضافة فاتورة
          </Button>
        }
      />

      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          المورد رقم: {supplierId}
        </div>

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
        onPurchaseDeleted={handlePurchaseDeleted}
      />
    </div>
  );
}
