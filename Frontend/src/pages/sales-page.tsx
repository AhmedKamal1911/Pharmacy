// @/app/sales/page.tsx (أو مسار صفحتك)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";

import { useSales } from "@/features/sales/hooks/use-sales";
import { ShoppingCart } from "lucide-react";
import { SalesDialog } from "@/features/sales/components/dialog/sales-dialog";
import { SalesGrid } from "@/features/sales/components/ui/sales-grid";

export default function SalesPage() {
  const { data: stats, isError } = useSales();

  // التحكم في حالة الفتح والإغلاق
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="المبيعات"
        description="نظرة عامة على أداء المبيعات والمخزون"
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsSalesOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 shadow-md cursor-pointer"
            >
              <ShoppingCart size={18} />
              بيع جديد
            </Button>
          </div>
        }
      />

      {/* استخدام المكون المنفصل هنا */}
      <SalesDialog isOpen={isSalesOpen} onClose={() => setIsSalesOpen(false)} />

      {/* باقي محتوى الصفحة (Stats) */}
      <div className="mt-8">
        {isError ? (
          <div className="p-12 border rounded-xl text-center bg-destructive/5 text-destructive">
            خطأ في تحميل البيانات..
          </div>
        ) : (
          <SalesGrid stats={stats} />
        )}
      </div>
    </div>
  );
}
