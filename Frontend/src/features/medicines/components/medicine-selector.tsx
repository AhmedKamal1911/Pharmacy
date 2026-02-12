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
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { mockMedicines } from "../api/mock-data";

interface MedicineSelectorProps {
  value?: string;
  onValueChange: (medicineId: string, medicineName: string) => void;
  placeholder?: string;
  className?: string;
}

export function MedicineSelector({
  value,
  onValueChange,
  placeholder = "اختر الصنف",
  className,
}: MedicineSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const selectedMedicine = mockMedicines.find((m) => m.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          {selectedMedicine ? selectedMedicine.name : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="max-h-60">
          <CommandInput placeholder="ابحث عن صنف..." />
          <CommandGroup className="max-h-40 overflow-y-auto">
            {mockMedicines.map((medicine) => (
              <CommandItem
                key={medicine.id}
                onSelect={() => {
                  onValueChange(medicine.id, medicine.name);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center py-2"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === medicine.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {medicine.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>لا يوجد صنف بهذا الاسم</CommandEmpty>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
