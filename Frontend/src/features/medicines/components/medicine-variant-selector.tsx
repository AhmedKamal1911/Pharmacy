import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { medicines, type Medicine, type MedicineVariant } from "@/data/medicines";

interface MedicineVariantSelectorProps {
  medicineId: string;
  value?: string;
  onValueChange: (
    variantId: string,
    variant: MedicineVariant,
  ) => void;
  onAddNewVariant?: () => void;
  placeholder?: string;
  className?: string;
}

export function MedicineVariantSelector({
  medicineId,
  value,
  onValueChange,
  onAddNewVariant,
  placeholder = "اختر المتغير",
  className,
}: MedicineVariantSelectorProps) {
  const [open, setOpen] = useState(false);

  const medicine = medicines.find((m: Medicine) => m.id === medicineId);
  const selectedVariant = medicine?.variants.find((v: MedicineVariant) => v.id === value);

  if (!medicine) {
    return (
      <div className="text-sm text-muted-foreground">
        اختر الصنف أولاً
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-slate-700">
        {medicine.name}
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-full justify-between", className)}
          >
            {selectedVariant ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  السعر: {selectedVariant.price} جنيه
                </span>
                {selectedVariant.expiryDate && (
                  <Badge variant="secondary" className="text-xs">
                    انتهاء: {selectedVariant.expiryDate}
                  </Badge>
                )}
                {selectedVariant.batchNumber && (
                  <Badge variant="outline" className="text-xs">
                    {selectedVariant.batchNumber}
                  </Badge>
                )}
              </div>
            ) : (
              placeholder
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command className="max-h-60">
            <CommandInput placeholder="ابحث عن متغير..." />
            <CommandGroup className="max-h-40 overflow-y-auto">
              {medicine.variants.map((variant: MedicineVariant) => (
                <CommandItem
                  key={variant.id}
                  onSelect={() => {
                    onValueChange(variant.id, variant);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center py-3"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === variant.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {variant.price} جنيه
                      </span>
                      {variant.expiryDate && (
                        <Badge variant="secondary" className="text-xs">
                          انتهاء: {variant.expiryDate}
                        </Badge>
                      )}
                      {variant.batchNumber && (
                        <Badge variant="outline" className="text-xs">
                          {variant.batchNumber}
                        </Badge>
                      )}
                    </div>
                    {variant.stock > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        المخزون: {variant.stock} وحدة
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandEmpty>لا يوجد متغير بهذا المواصفات</CommandEmpty>
          </Command>
        </PopoverContent>
      </Popover>

      {onAddNewVariant && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddNewVariant}
          className="w-full"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة متغير جديد (سعر أو صلاحية مختلفة)
        </Button>
      )}
    </div>
  );
}
