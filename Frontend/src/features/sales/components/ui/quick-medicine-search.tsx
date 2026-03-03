"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
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

interface QuickMedicineSearchProps {
  onMedicineSelect: (medicine: Medicine, variant: MedicineVariant) => void;
}

export function QuickMedicineSearch({
  onMedicineSelect,
}: QuickMedicineSearchProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="gap-2 h-11 px-6 border-amber-200 hover:border-amber-300 hover:bg-amber-50 text-amber-700 transition-all duration-200"
        >
          <Zap size={18} />
          <span className="font-medium">صنف سريع</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start" side="bottom">
        {/* تركنا Command يعمل بشكل طبيعي بدون تدخل */}
        <Command>
          <CommandInput
            placeholder="ابحث بالاسم أو الكود..."
            className="border-none focus:ring-0"
          />

          <CommandList>
            <CommandEmpty>لا توجد نتائج</CommandEmpty>
            <CommandGroup>
              {medicines.map((medicine) => (
                <div key={medicine.id}>
                  <div className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-50 sticky top-0">
                    {medicine.id} - {medicine.name}
                  </div>
                  {medicine.variants.map((variant) => (
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
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {medicine.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          الكود: {medicine.id} | المخزون: {variant.stock}
                          {variant.batchNumber &&
                            ` | دفعة: ${variant.batchNumber}`}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-primary">
                          {variant.price} ج.م
                        </div>
                        {variant.expiryDate && (
                          <div className="text-xs text-slate-500">
                            صلاحية: {variant.expiryDate}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
