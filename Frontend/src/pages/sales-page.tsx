import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SalesGrid } from "@/features/sales/components/sales-grid";
import { useSales } from "@/features/sales/hooks/use-sales";
import { Plus, ShoppingCart } from "lucide-react";

export default function SalesPage() {
  const { data: stats, isError } = useSales();

  const handleQuickSale = () => {
    // TODO: Open quick sale dialog/modal
    console.log("Quick sale clicked");
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="المبيعات"
        description="نظرة عامة على أداء المبيعات والمخزون"
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={handleQuickSale}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ShoppingCart size={18} />
              بيع سريع
            </Button>
            <Button
              onClick={handleQuickSale}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus size={18} />
              بيع جديد
            </Button>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="mt-6">
        {isError ? (
          <div className="p-12 border-2 border-dashed rounded-xl text-center">
            <p className="text-destructive">
              حدث خطأ أثناء تحميل بيانات المبيعات. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        ) : (
          <SalesGrid stats={stats} />
        )}
      </div>
    </div>
  );
}
