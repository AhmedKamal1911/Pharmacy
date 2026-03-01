import { Card } from "@/components/ui/card";
import { Warehouse, Package, TrendingUp, Filter } from "lucide-react";
import type { StockSummary } from "../../types";

interface StockSummaryCardsProps {
  summary: StockSummary;
  filteredItemsCount: number;
}

export function StockSummaryCards({
  summary,
  filteredItemsCount,
}: StockSummaryCardsProps) {
  return (
    <>
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">إجمالي الأصناف</p>
            <p className="text-3xl font-bold mt-1">{filteredItemsCount}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Package className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">إجمالي الوحدات</p>
            <p className="text-3xl font-bold mt-1">
              {summary.totalUnits.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Warehouse className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">
              القيمة الإجمالية
            </p>
            <p className="text-3xl font-bold mt-1">
              EGP {summary.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">
              متوسط القيمة للصنف
            </p>
            <p className="text-3xl font-bold mt-1">
              EGP {Math.round(summary.averageValuePerItem).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Filter className="h-8 w-8 text-white" />
          </div>
        </div>
      </Card>
    </>
  );
}
