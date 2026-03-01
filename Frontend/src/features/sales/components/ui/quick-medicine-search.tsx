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
import { medicines, type Medicine } from "@/data/medicines";

interface QuickMedicineSearchProps {
  onMedicineSelect: (medicine: Medicine) => void;
}

export function QuickMedicineSearch({ onMedicineSelect }: QuickMedicineSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
      <PopoverContent
        className="w-80 p-0"
        align="start"
        side="bottom"
      >
        <Command>
          <CommandInput
            placeholder="ابحث بالاسم أو الكود..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>لا توجد نتائج</CommandEmpty>
            <CommandGroup>
              {filteredMedicines.map((medicine) => (
                <CommandItem
                  key={medicine.id}
                  onSelect={() => {
                    onMedicineSelect(medicine);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {medicine.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      الكود: {medicine.id} | المخزون:{" "}
                      {medicine.stock}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-primary">
                      {medicine.price} ج.م
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
