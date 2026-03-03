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
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { medicines } from "@/data/medicines";
import type { Medicine, MedicineVariant } from "@/data/medicines";

interface MedicineSelectorProps {
  value?: string;
  onValueChange: (
    medicineId: string,
    medicineName: string,
    medicineCode?: string,
    variantId?: string,
    variant?: MedicineVariant,
  ) => void;
  placeholder?: string;
  className?: string;
  showVariants?: boolean;
}

export function MedicineSelector({
  value,
  onValueChange,
  placeholder = "اختر الصنف",
  className,
  showVariants = false,
}: MedicineSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedMedicine = medicines.find((m: Medicine) => m.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("w-full justify-between", className)}
        >
          {selectedMedicine ? selectedMedicine.name : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="max-h-60">
          <CommandInput placeholder="ابحث عن صنف..." />
          <CommandGroup className="max-h-40 overflow-y-auto">
            {medicines.map((medicine: Medicine) => (
              <CommandItem
                key={medicine.id}
                onSelect={() => {
                  onValueChange(medicine.id, medicine.name, medicine.code);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center py-2"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === medicine.id ? "opacity-100" : "opacity-0",
                  )}
                />
                <div className="flex-1">
                  <div className="font-medium">{medicine.name}</div>
                  {showVariants && medicine.variants.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {medicine.variants.length} متغيرات متاحة
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>لا يوجد صنف بهذا الاسم</CommandEmpty>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
