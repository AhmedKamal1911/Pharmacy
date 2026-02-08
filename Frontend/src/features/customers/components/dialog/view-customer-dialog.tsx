import {
  Phone,
  MapPin,
  CreditCard,
  Percent,
  User,
  Calendar,
  TrendingUp,
  Shield,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Customer } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoneyAmount } from "../ui/money-amount";

interface ViewCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewCustomerDialog({
  customer,
  open,
  onOpenChange,
}: ViewCustomerDialogProps) {
  if (!customer) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getBalanceColor = (balance: number) => {
    if (balance < 0) return "text-red-600 bg-red-50 border-red-200";
    if (balance > 0) return "text-green-600 bg-green-50 border-green-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getBalanceText = (balance: number) => {
    if (balance < 0) return "مدين";
    if (balance > 0) return "دائن";
    return "متوازن";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] pt-10 px-3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5" />
            تفاصيل العميل
          </DialogTitle>
          <DialogDescription>عرض معلومات العميل الكاملة</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 pe-4 py-1">
            {/* Customer Header */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-primary">
                      {customer.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          customer.type === "COMPANY" ? "outline" : "secondary"
                        }
                        className="text-xs px-2 py-1"
                      >
                        {customer.type}
                      </Badge>
                      <Badge
                        variant={
                          customer.isCashOnly ? "destructive" : "default"
                        }
                        className="text-xs px-2 py-1"
                      >
                        {customer.isCashOnly ? "نقداً فقط" : "دفع متنوع"}
                      </Badge>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-2 rounded-lg border ${getBalanceColor(customer.balance)}`}
                  >
                    <div className="text-xs font-medium">
                      {getBalanceText(customer.balance)}
                    </div>
                    <MoneyAmount amount={customer.balance} size="lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Contact Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Phone className="h-4 w-4" />
                    معلومات الاتصال
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-2">
                  {customer.phone && (
                    <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">
                          رقم الهاتف
                        </div>
                        <div className="font-medium text-sm">
                          {customer.phone}
                        </div>
                      </div>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-start gap-3 p-2 bg-muted/30 rounded-lg">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">
                          العنوان
                        </div>
                        <div className="font-medium text-sm">
                          {customer.address}
                        </div>
                      </div>
                    </div>
                  )}
                  {customer.lastTransactionAt && (
                    <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">
                          آخر معاملة
                        </div>
                        <div className="font-medium text-sm">
                          {formatDate(customer.lastTransactionAt)}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Financial Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="h-4 w-4" />
                    المعلومات المالية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/30 rounded-lg p-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        حد الائتمان
                      </div>
                      <div className="flex items-center justify-start">
                        <MoneyAmount
                          amount={customer.creditLimit}
                          showIcon={false}
                        />
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        الرصيد الحالي
                      </div>
                      <div className="flex items-center justify-start">
                        <MoneyAmount
                          amount={customer.balance}
                          showIcon={false}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-blue-50/70 border border-blue-200/50 rounded-lg">
                      <Percent className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="text-xs text-blue-600">
                          الخصم المحلي
                        </div>
                        <div className="font-bold text-sm text-blue-700">
                          {customer.localDiscount}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-purple-50/70 border border-purple-200/50 rounded-lg">
                      <Percent className="h-4 w-4 text-purple-600" />
                      <div className="flex-1">
                        <div className="text-xs text-purple-600">
                          خصم الاستيراد
                        </div>
                        <div className="font-bold text-sm text-purple-700">
                          {customer.importDiscount}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Loyalty Program */}
            {customer.loyalty && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4" />
                    برنامج الولاء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-gradient-to-br from-yellow-50/80 to-orange-50/80 border border-yellow-200/50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-700">
                        {customer.loyalty.totalPoints}
                      </div>
                      <div className="text-xs text-yellow-600">
                        النقاط الإجمالية
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 border border-blue-200/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">
                        {customer.loyalty.pendingPoints}
                      </div>
                      <div className="text-xs text-blue-600">
                        النقاط المعلقة
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-green-50/80 to-emerald-50/80 border border-green-200/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">
                        {customer.loyalty.pointsPerCurrency}
                      </div>
                      <div className="text-xs text-green-600">نقاط كل عملة</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Status */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <div className="text-xs text-primary">
                    <span className="font-medium">حالة العميل:</span>
                    <span className="mr-2">
                      {customer.isCashOnly ? "عميل نقدي فقط" : "عميل ائتماني"}
                    </span>
                    {customer.type === "COMPANY" && "• شركة"}
                    {customer.balance > 0 && "• له رصيد"}
                    {customer.balance < 0 && "• عليه ديون"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
