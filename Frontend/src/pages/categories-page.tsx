import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CategoriesTableWithFilters } from "../features/categories/components/table/categories-table-with-filters";
import { createColumns } from "../features/categories/components/table/columns";
import { AddCategoryDialog } from "../features/categories/components/dialog/add-category-dialog";
import { useCategories } from "../features/categories/hooks/use-categories";
import { X, Grid3x3, Package, TrendingUp } from "lucide-react";

export default function CategoriesPage() {
  const { categories: categoriesList, isLoading, error } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleCategoryAdded = () => {
    // This will be handled by the hook refetch
    window.location.reload();
  };

  const filteredCategories = useMemo(() => {
    let filtered = categoriesList;

    if (searchQuery) {
      filtered = filtered.filter(
        (category) =>
          category.categoryName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          category.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          category.categoryId.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((category) => {
        if (statusFilter === "active") {
          return category.isActive;
        } else if (statusFilter === "inactive") {
          return !category.isActive;
        }
        return true;
      });
    }

    return filtered;
  }, [categoriesList, searchQuery, statusFilter]);

  const totalCategories = filteredCategories.length;
  const activeCategories = filteredCategories.filter(
    (cat) => cat.isActive,
  ).length;
  const inactiveCategories = filteredCategories.filter(
    (cat) => !cat.isActive,
  ).length;
  const totalItems = filteredCategories.reduce(
    (sum, cat) => sum + cat.totalItems,
    0,
  );

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const columns = createColumns();

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <div className="bg-red-100 rounded-full p-2">
            <X className="h-5 w-5 text-red-600" />
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
          title="إدارة الفئات"
          description="متابعة وإدارة فئات الأدوية والمنتجات الصيدلية"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    إجمالي الفئات
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalCategories}
                  </p>
                </div>
                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Grid3x3 className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    فئات نشطة
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {activeCategories}
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    فئات غير نشطة
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {inactiveCategories}
                  </p>
                </div>
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    إجمالي الأصناف
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalItems}
                  </p>
                </div>
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Table with integrated filters - matching returns page structure */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                قائمة الفئات
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                عرض وإدارة جميع فئات الأدوية في النظام
              </p>
            </div>
            <AddCategoryDialog onCategoryAdded={handleCategoryAdded} />
          </div>
        </div>
        <CategoriesTableWithFilters
          data={filteredCategories}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onReset={clearFilters}
          allData={categoriesList}
          isLoading={isLoading}
          columns={columns}
        />
      </div>
    </div>
  );
}
