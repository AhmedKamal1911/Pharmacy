import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { MedicinesTableWithFilters } from "../features/medicines/components/table/medicines-table-with-filters";
import { createColumns } from "../features/medicines/components/table/columns";
import type { Medicine } from "../features/medicines/types";
import { AddMedicineDialog } from "../features/medicines/components/dialog/add-medicine-dialog";
import { useMedicines } from "../features/medicines/hooks/use-medicines";
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

export function MedicinesPage() {
  const { medicines, isLoading, error, refetch } = useMedicines();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [minStockFilter, setMinStockFilter] = useState<boolean>(false);

  const handleViewMedicine = (medicine: Medicine) => {
    // TODO: Implement view medicine dialog
    console.log("View medicine:", medicine);
  };

  const handleEditMedicine = (medicine: Medicine) => {
    // TODO: Implement edit medicine functionality
    console.log("Edit medicine:", medicine);
  };

  const handleDeleteMedicine = (medicine: Medicine) => {
    // TODO: Implement delete medicine functionality
    console.log("Delete medicine:", medicine);
  };

  const handleMedicineAdded = () => {
    refetch();
  };

  const filteredMedicines = useMemo(() => {
    let filtered = medicines;

    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((m) => m.category === categoryFilter);
    }

    if (minStockFilter) {
      filtered = filtered.filter((m) => {
        const totalStock = m.variants.reduce(
          (sum, variant) => sum + variant.stock,
          0,
        );
        return totalStock <= (m.minStock || 0);
      });
    }

    return filtered;
  }, [medicines, searchQuery, categoryFilter, minStockFilter]);

  const totalMedicines = filteredMedicines.length;
  const lowStockMedicines = filteredMedicines.filter((m) => {
    const totalStock = m.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0,
    );
    return totalStock <= (m.minStock || 0);
  }).length;
  const totalValue = filteredMedicines.reduce((sum, m) => {
    const medicineValue = m.variants.reduce(
      (variantSum, variant) => variantSum + variant.price * variant.stock,
      0,
    );
    return sum + medicineValue;
  }, 0);
  const totalCategories = new Set(filteredMedicines.map((m) => m.category))
    .size;

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setMinStockFilter(false);
  };

  const columns = createColumns(
    handleViewMedicine,
    handleEditMedicine,
    handleDeleteMedicine,
  );

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <div className="bg-red-100 rounded-full p-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-800">حدث خطأ</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-10">
        <PageHeader
          title="إدارة الأصناف"
          description="متابعة وإدارة أصناف الأدوية والمستحضرات الطبية الخاصة بالصيدلية"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    إجمالي الأصناف
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalMedicines}
                  </p>
                </div>
                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    مخزون منخفض
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {lowStockMedicines}
                  </p>
                </div>
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    إجمالي القيمة
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalValue.toLocaleString("ar-EG")}
                  </p>
                </div>
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    عدد الفئات
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalCategories}
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Medicine Button */}
      <div className="mb-6">
        <AddMedicineDialog onMedicineAdded={handleMedicineAdded} />
      </div>

      {/* Table with integrated filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <MedicinesTableWithFilters
          data={filteredMedicines}
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          minStockFilter={minStockFilter}
          onSearchChange={setSearchQuery}
          onCategoryChange={setCategoryFilter}
          onMinStockChange={setMinStockFilter}
          onReset={clearFilters}
          allData={medicines}
          isLoading={isLoading}
          columns={columns}
        />
      </div>
    </div>
  );
}
