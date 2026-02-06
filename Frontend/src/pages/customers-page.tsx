import { Download } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CustomersTable } from "@/features/customers/components/table/customers-table";
import { createColumns } from "@/features/customers/components/table/columns";
import { AddCustomerDialog } from "@/features/customers/components/dialog/add-customer-dialog";
import { ViewCustomerDialog } from "@/features/customers/components/dialog/view-customer-dialog";
import { EditCustomerDialog } from "@/features/customers/components/dialog/edit-customer-dialog";
import { DeleteCustomerDialog } from "@/features/customers/components/dialog/delete-customer-dialog";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import type { Customer } from "@/features/customers/types";

export default function CustomersPage() {
  const {
    customers,
    isLoading,
    isError,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const handleCustomerAdded = (newCustomer: Customer) => {
    addCustomer(newCustomer);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    updateCustomer(updatedCustomer.id, updatedCustomer);
  };

  const handleCustomerDeleted = (customerId: string) => {
    deleteCustomer(customerId);
  };

  // Action handlers
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  // Create columns with action handlers
  const columns = createColumns({
    onView: handleViewCustomer,
    onEdit: handleEditCustomer,
    onDelete: handleDeleteCustomer,
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">العملاء</h1>

        <div className="flex items-center gap-3">
          {/* Rule #1: Arabic Labels & shadcn Button */}
          <Button variant="outline" className=" flex items-center gap-2">
            <Download size={18} />
            تصدير البيانات
          </Button>
          <AddCustomerDialog
            onCustomerAdded={handleCustomerAdded}
            trigger={
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                إضافة عميل جديد
              </Button>
            }
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isError ? (
        <div className="p-12 border-2 border-dashed rounded-xl text-center">
          <p className="text-destructive ">
            حدث خطأ أثناء تحميل بيانات العملاء. يرجى المحاولة مرة أخرى.
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          {/* Rule #3: Dynamic DataTable with Loading State */}
          <CustomersTable
            columns={columns}
            data={customers}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Dialogs */}
      <ViewCustomerDialog
        customer={selectedCustomer}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditCustomerDialog
        customer={selectedCustomer}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onCustomerUpdated={handleCustomerUpdated}
      />

      <DeleteCustomerDialog
        customer={selectedCustomer}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onCustomerDeleted={handleCustomerDeleted}
      />
    </div>
  );
}
