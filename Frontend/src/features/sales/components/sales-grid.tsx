import {
  Package,
  AlertTriangle,
  Warehouse,
  DollarSign,
  TrendingUp,
  FileText,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { SalesStats } from "../types";

interface SalesGridProps {
  stats: SalesStats;
}

export function SalesGrid({ stats }: SalesGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Best Selling Medicine */}
      <Card className="group relative overflow-hidden rounded-xl border-2 border-amber-200/20 bg-gradient-to-br from-amber-50/70 to-amber-100/50 p-5 shadow-md hover:shadow-lg transition-all duration-400 hover:-translate-y-2 cursor-pointer">
        <div className="absolute -inset-1 rounded-xl border-4 border-amber-400/0 group-hover:border-amber-400 transition-all duration-1000 shadow-amber-400/50" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 p-3 shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-400 border border-amber-600/10">
              <Award className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
            <div className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1.5 shadow-md group-hover:scale-105 transition-transform duration-300 border border-amber-600/20">
              <span className="text-sm font-black text-white drop-shadow-md">
                الأفضل
              </span>
            </div>
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1 group-hover:text-amber-600 transition-colors duration-300 tracking-tight">
            {stats.bestSellingMedicine.name}
          </h3>
          <p className="text-sm text-gray-700 font-medium">
            {stats.bestSellingMedicine.sales} {stats.bestSellingMedicine.unit}{" "}
            اليوم
          </p>
          <div className="mt-3 flex items-center gap-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold">↗ عرض التفاصيل</span>
          </div>
        </div>
      </Card>

      {/* Low Stock Items - Clickable */}
      <Card
        onClick={() => console.log("Open low stock report")}
        className="group relative overflow-hidden rounded-xl border-2 border-orange-200/20 bg-gradient-to-br from-orange-50/70 to-orange-100/50 p-5 shadow-md hover:shadow-lg transition-all duration-400 hover:-translate-y-2 cursor-pointer"
      >
        <div className="absolute -inset-1 rounded-xl border-4 border-orange-400/0 group-hover:border-orange-400 transition-all duration-1000 shadow-orange-400/50" />
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-red-400/30 to-red-500/15 rounded-full blur-xl animate-pulse" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 p-3 shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-400 border border-orange-600/10">
              <AlertTriangle className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-300 to-red-400 px-2 py-1 shadow-sm group-hover:scale-105 transition-transform duration-300 border border-red-500/30">
              <span className="text-xs font-black text-white">↑ 3</span>
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-300 tracking-tight">
            {stats.lowStockItems}
          </h3>
          <p className="text-sm text-gray-700 font-medium">أصناف ناقصة</p>
          <p className="text-xs text-orange-600 mt-1 font-semibold">
            تحتاج لإعادة طلب فوراً
          </p>
          <div className="mt-3 flex items-center gap-2 text-orange-600 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold">↗ عرض التقرير</span>
          </div>
        </div>
      </Card>

      {/* Expiring Items - Clickable */}
      <Card
        onClick={() => console.log("Open expiring items report")}
        className="group relative overflow-hidden rounded-xl border-2 border-red-200/20 bg-gradient-to-br from-red-50/70 to-red-100/50 p-5 shadow-md hover:shadow-lg transition-all duration-400 hover:-translate-y-2 cursor-pointer"
      >
        <div className="absolute -inset-1 rounded-xl border-4 border-red-400/0 group-hover:border-red-400 transition-all duration-1000 shadow-red-400/50" />
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-red-400/30 to-red-500/15 rounded-full blur-xl animate-pulse" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-gradient-to-br from-red-400 to-red-500 p-3 shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-400 border border-red-600/10">
              <Package className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-green-300 to-green-400 px-2 py-1 shadow-sm group-hover:scale-105 transition-transform duration-300 border border-green-500/30">
              <span className="text-xs font-black text-white">↓ 2</span>
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1 group-hover:text-red-600 transition-colors duration-300 tracking-tight">
            {stats.expiringItems}
          </h3>
          <p className="text-sm text-gray-700 font-medium">أصناف منتهية</p>
          <p className="text-xs text-red-600 mt-1 font-semibold">
            خلال 30 يوم القادم
          </p>
          <div className="mt-3 flex items-center gap-2 text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold">↗ عرض التقرير</span>
          </div>
        </div>
      </Card>

      {/* Total Stock */}
      <Card className="group relative overflow-hidden rounded-xl border-2 border-blue-200/20 bg-gradient-to-br from-blue-50/70 to-blue-100/50 p-5 shadow-md hover:shadow-lg transition-all duration-400 hover:-translate-y-2 cursor-pointer">
        <div className="absolute -inset-1 rounded-xl border-4 border-blue-400/0 group-hover:border-blue-400 transition-all duration-1000 shadow-blue-400/50" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 p-3 shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-400 border border-blue-600/10">
              <Warehouse className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 tracking-tight">
            {stats.totalStock.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-700 font-medium">إجمالي المخزون</p>
          <p className="text-xs text-blue-600 mt-1 font-semibold">
            وحدة في المخزون
          </p>
          <div className="mt-3 flex items-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold">↗ عرض التفاصيل</span>
          </div>
        </div>
      </Card>

      {/* Today Sales */}
      <Card className="group relative overflow-hidden rounded-xl border-2 border-green-200/20 bg-gradient-to-br from-green-50/70 to-green-100/50 p-5 shadow-md hover:shadow-lg transition-all duration-400 hover:-translate-y-2 cursor-pointer">
        <div className="absolute -inset-1 rounded-xl border-4 border-green-400/0 group-hover:border-green-400 transition-all duration-1000 shadow-green-400/50" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-gradient-to-br from-green-400 to-green-500 p-3 shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-400 border border-green-600/10">
              <DollarSign className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-green-300 to-green-400 px-2 py-1 shadow-sm group-hover:scale-105 transition-transform duration-300 border border-green-500/30">
              <span className="text-xs font-black text-white">↑ 12.5%</span>
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-green-600 transition-colors duration-300 tracking-tight">
            EGP {stats.todaySales.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-700 font-medium">المبيعات اليوم</p>
          <p className="text-xs text-green-600 mt-1 font-semibold">
            +12.5% عن أمس
          </p>
          <div className="mt-3 flex items-center gap-2 text-green-600 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold">↗ عرض التفاصيل</span>
          </div>
        </div>
      </Card>

      {/* Today Profit */}
      <Card className="group relative overflow-hidden rounded-xl border-2 border-emerald-200/20 bg-gradient-to-br from-emerald-50/70 to-emerald-100/50 p-5 shadow-md hover:shadow-lg transition-all duration-400 hover:-translate-y-2 cursor-pointer">
        <div className="absolute -inset-1 rounded-xl border-4 border-emerald-400/0 group-hover:border-emerald-400 transition-all duration-1000 shadow-emerald-400/50" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 p-3 shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-400 border border-emerald-600/10">
              <TrendingUp className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-green-300 to-green-400 px-2 py-1 shadow-sm group-hover:scale-105 transition-transform duration-300 border border-green-500/30">
              <span className="text-xs font-black text-white">↑ 8.2%</span>
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors duration-300 tracking-tight">
            EGP {stats.todayProfit.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-700 font-medium">صافي الربح اليوم</p>
          <p className="text-xs text-emerald-600 mt-1 font-semibold">
            بعد خصم التكاليف
          </p>
          <div className="mt-3 flex items-center gap-2 text-emerald-600 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold">↗ عرض التفاصيل</span>
          </div>
        </div>
      </Card>

      {/* Today Invoices - Clickable */}
      <Card
        onClick={() => console.log("Open today invoices report")}
        className="group relative overflow-hidden rounded-xl border-2 border-purple-200/20 bg-gradient-to-br from-purple-50/70 to-purple-100/50 p-5 shadow-md hover:shadow-lg transition-all duration-400 hover:-translate-y-2 cursor-pointer"
      >
        <div className="absolute -inset-1 rounded-xl border-4 border-purple-400/0 group-hover:border-purple-400 transition-all duration-1000 shadow-purple-400/50" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 p-3 shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-400 border border-purple-600/10">
              <FileText className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-green-300 to-green-400 px-2 py-1 shadow-sm group-hover:scale-105 transition-transform duration-300 border border-green-500/30">
              <span className="text-xs font-black text-white">↑ 5</span>
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300 tracking-tight">
            {stats.todayInvoices}
          </h3>
          <p className="text-sm text-gray-700 font-medium">الفواتير اليوم</p>
          <p className="text-xs text-purple-600 mt-1 font-semibold">
            فاتورة صادرة اليوم
          </p>
          <div className="mt-3 flex items-center gap-2 text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold">↗ عرض الفواتير</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
