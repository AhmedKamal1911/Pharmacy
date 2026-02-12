import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { purchasesMock, deletePurchase } from "../api/mock-data";

export function usePurchases(supplierIdParam?: string) {
  const [searchParams] = useSearchParams();
  const [, forceUpdate] = useState({});

  const supplierId = supplierIdParam || searchParams.get("supplierId");

  const purchases = useMemo(() => {
    // If supplierId exists, filter purchases for that supplier
    if (supplierId) {
      return purchasesMock.filter(
        (purchase) => purchase.supplierId === supplierId,
      );
    }
    // Otherwise return all purchases
    return purchasesMock;
  }, [supplierId]);

  const handleDeletePurchase = (id: string) => {
    const success = deletePurchase(id);
    if (success) {
      // Force re-render to update the list
      forceUpdate({});
    }
    return success;
  };

  return {
    purchases,
    isLoading: false,
    isError: false,
    supplierId,
    deletePurchase: handleDeletePurchase,
  };
}
