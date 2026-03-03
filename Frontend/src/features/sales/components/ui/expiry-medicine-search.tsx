"use client";

import { useState, useMemo } from "react";
import { Clock, AlertTriangle, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  medicines,
  type Medicine,
  type MedicineVariant,
} from "@/data/medicines";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExpiryMedicineSearchProps {
  onMedicineSelect: (medicine: Medicine, variant: MedicineVariant) => void;
}

// تحديد الأدوية القريبة من الانتهاء (خلال 3 أشهر القادمة)
const getExpiringMedicines = () => {
  const today = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  const expiringVariants: Array<{
    medicine: Medicine;
    variant: MedicineVariant;
  }> = [];

  medicines.forEach((medicine) => {
    medicine.variants.forEach((variant) => {
      if (!variant.expiryDate) return;

      // تحويل تاريخ الانتهاء من MM/YY إلى Date
      const [month, year] = variant.expiryDate.split("/");
      const expiryDate = new Date(`20${year}`, parseInt(month, 10) - 1, 1);

      if (expiryDate <= threeMonthsFromNow && expiryDate >= today) {
        expiringVariants.push({ medicine, variant });
      }
    });
  });

  return expiringVariants.sort((a, b) => {
    // الترتيب حسب قرب تاريخ الانتهاء
    if (!a.variant.expiryDate || !b.variant.expiryDate) return 0;
    const [monthA, yearA] = a.variant.expiryDate.split("/");
    const [monthB, yearB] = b.variant.expiryDate.split("/");
    const dateA = new Date(`20${yearA}`, parseInt(monthA, 10) - 1, 1);
    const dateB = new Date(`20${yearB}`, parseInt(monthB, 10) - 1, 1);
    return dateA.getTime() - dateB.getTime();
  });
};

export function ExpiryMedicineSearch({
  onMedicineSelect,
}: ExpiryMedicineSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const expiringMedicines = useMemo(() => {
    const items = getExpiringMedicines();

    if (!search.trim()) return items;

    const lowerSearch = search.toLowerCase();
    return items.filter(
      ({ medicine, variant }) =>
        String(medicine.id).toLowerCase().includes(lowerSearch) ||
        medicine.name.toLowerCase().includes(lowerSearch) ||
        String(variant.id).toLowerCase().includes(lowerSearch),
    );
  }, [search]);

  // تحديد لون الشارة حسب قرب تاريخ الانتهاء
  const getExpiryBadgeVariant = (expiryDate: string) => {
    const today = new Date();
    const [month, year] = expiryDate.split("/");
    const expiry = new Date(`20${year}`, parseInt(month, 10) - 1, 1);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiry <= 30) return "destructive";
    if (daysUntilExpiry <= 60) return "secondary";
    return "outline";
  };

  const getExpiryText = (expiryDate: string) => {
    const today = new Date();
    const [month, year] = expiryDate.split("/");
    const expiry = new Date(`20${year}`, parseInt(month, 10) - 1, 1);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiry <= 0) return "منتهي الصلاحية";
    if (daysUntilExpiry <= 30) return `ينتهي خلال ${daysUntilExpiry} يوم`;
    if (daysUntilExpiry <= 60)
      return `ينتهي خلال ${Math.ceil(daysUntilExpiry / 30)} شهر`;
    return `ينتهي ${expiryDate}`;
  };

  const getExpiryIcon = (expiryDate: string) => {
    const today = new Date();
    const [month, year] = expiryDate.split("/");
    const expiry = new Date(`20${year}`, parseInt(month, 10) - 1, 1);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiry <= 30) return AlertTriangle;
    if (daysUntilExpiry <= 60) return Clock;
    return Calendar;
  };

  const getStockColor = (stock: number) => {
    if (stock <= 20) return "text-red-600";
    if (stock <= 50) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="gap-2 h-11 px-6 border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-700 transition-all duration-200"
        >
          <Clock size={18} />
          <span className="font-medium">منتجات قريبة الانتهاء</span>
          {expiringMedicines.length > 0 && (
            <Badge variant="destructive" className="ml-1 px-2 py-0 text-xs">
              {expiringMedicines.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="start" side="bottom">
        <Command>
          <CommandInput
            placeholder="ابحث في المنتجات القريبة الانتهاء..."
            value={search}
            onValueChange={setSearch}
            className="border-none focus:ring-0"
          />

          <CommandList>
            <CommandEmpty>
              لا توجد منتجات قريبة الانتهاء تطابق البحث
            </CommandEmpty>
            <CommandGroup>
              {expiringMedicines.map(({ medicine, variant }) => {
                const ExpiryIcon = getExpiryIcon(variant.expiryDate!);
                return (
                  <CommandItem
                    key={variant.id}
                    value={String(variant.id)}
                    keywords={[medicine.name]}
                    onSelect={() => {
                      setTimeout(() => {
                        onMedicineSelect(medicine, variant);
                        setOpen(false);
                      }, 0);
                    }}
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <Package size={18} className="text-orange-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm text-slate-900 truncate">
                          {medicine.name}
                        </h4>
                        {variant.batchNumber && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                            {variant.batchNumber}
                          </span>
                        )}
                        <Badge
                          variant={getExpiryBadgeVariant(variant.expiryDate!)}
                          className="text-xs px-2 py-0.5 flex items-center gap-1"
                        >
                          <ExpiryIcon size={10} />
                          {getExpiryText(variant.expiryDate!)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            {medicine.id}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1 font-medium",
                            getStockColor(variant.stock),
                          )}
                        >
                          <Package size={12} />
                          {variant.stock} قطعة
                        </div>
                        <div className="text-slate-400">|</div>
                        <div className="font-bold text-primary">
                          {variant.price} ج.م
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
