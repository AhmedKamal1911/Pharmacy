import { Download } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SupplierTable } from "@/features/suppliers/components/table/supplier-table";
import { createSupplierColumns } from "@/features/suppliers/components/table/columns";
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers";
import { AddSupplierDialog } from "@/features/suppliers/components/dialog/add-supplier-dialog";
import type { Supplier } from "@/features/suppliers/types";

export default function SuppliersPage() {
  const { suppliers, isLoading, isError } = useSuppliers();
  const [suppliersData, setSuppliersData] = useState<Supplier[]>([]);

  // Update local state when suppliers data changes
  React.useEffect(() => {
    if (suppliers) {
      setSuppliersData(suppliers);
    }
  }, [suppliers]);

  const handleSupplierAdded = (newSupplier: Supplier) => {
    setSuppliersData((prev) => [...prev, newSupplier]);
  };

  const handleSupplierUpdated = (updatedSupplier: Supplier) => {
    setSuppliersData((prev) =>
      prev.map((supplier) =>
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier,
      ),
    );
  };

  const handleSupplierDeleted = (supplierId: string) => {
    setSuppliersData((prev) =>
      prev.filter((supplier) => supplier.id !== supplierId),
    );
  };

  // Create table meta with data change handlers
  const tableMeta = {
    onDataChange: setSuppliersData,
  };

  // Create columns with handlers
  const columns = createSupplierColumns(
    handleSupplierUpdated,
    handleSupplierDeleted,
  );

  return (
    <div className="container mx-auto">
      <PageHeader
        title="الموردون"
        actions={
          <>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={18} />
              تصدير البيانات
            </Button>
            <AddSupplierDialog onSupplierAdded={handleSupplierAdded} />
          </>
        }
      />

      {/* Main Content Area */}
      <div className="mt-6">
        {isError ? (
          <div className="p-12 border-2 border-dashed rounded-xl text-center">
            <p className="text-destructive">
              حدث خطأ أثناء تحميل بيانات الموردين. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <SupplierTable
              columns={columns}
              data={suppliersData}
              isLoading={isLoading}
              meta={tableMeta}
            />
          </div>
        )}
      </div>
    </div>
  );
}
