import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-semibold">إجمالي المبيعات</h3>
        <p className="text-2xl font-bold text-primary">١٢٬٥٠٠ ريال</p>
        <p className="text-sm text-muted-foreground">+١٢٪ من الشهر الماضي</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-semibold">العملاء</h3>
        <p className="text-2xl font-bold text-primary">٢٤٥</p>
        <p className="text-sm text-muted-foreground">+٥٪ من الشهر الماضي</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-semibold">الأصناف</h3>
        <p className="text-2xl font-bold text-primary">١٬٨٢٣</p>
        <p className="text-sm text-muted-foreground">٢٣ منخفضة المخزون</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-semibold">الطلبات اليوم</h3>
        <p className="text-2xl font-bold text-primary">٤٧</p>
        <p className="text-sm text-muted-foreground">٣٣ مكتملة</p>
      </div>
    </div>
  );
}
