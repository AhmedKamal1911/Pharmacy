import { Card } from "@/components/ui/card";
import { BarChart3, Package } from "lucide-react";
import type { CategoryDistribution } from "../../types";

interface StockCategoryDistributionProps {
  distribution: CategoryDistribution[];
}

export function StockCategoryDistribution({
  distribution,
}: StockCategoryDistributionProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          توزيع المخزون حسب الفئة
        </h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {distribution.slice(0, 6).map((category) => (
          <div
            key={category.category}
            className="bg-white rounded-xl p-4 border border-indigo-100 hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-800">{category.category}</h4>
              <div className="bg-indigo-100 p-2 rounded-full">
                <Package className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">عدد الأصناف</span>
                <span className="font-bold text-indigo-600">
                  {category.itemCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">إجمالي الوحدات</span>
                <span className="font-bold text-green-600">
                  {category.totalStock.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-600">القيمة</span>
                <span className="font-bold text-purple-600">
                  EGP {category.totalValue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
