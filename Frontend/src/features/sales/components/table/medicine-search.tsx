"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
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

interface MedicineSearchProps {
  value: string;
  onChange: (value: string) => void;
  onMedicineSelect: (medicine: Medicine) => void;
}

export function MedicineSearch({
  value,
  onChange,
  onMedicineSelect,
}: MedicineSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedMedicine = medicines.find((m) => m.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full h-8 justify-between text-left font-normal border-none focus-visible:ring-1"
        >
          {selectedMedicine ? (
            <div className="flex items-center gap-2">
              <Package size={14} className="text-slate-500" />
              <span className="text-xs">{selectedMedicine.id}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              <span className="text-xs text-slate-400">ابحث عن دواء...</span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="ابحث بالكود أو اسم الدواء..."
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
                  value={medicine.id}
                  onSelect={() => {
                    onChange(medicine.id);
                    onMedicineSelect(medicine);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-3 p-2 cursor-pointer"
                >
                  <Package size={16} className="text-slate-500" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{medicine.id}</div>
                    <div className="text-xs text-slate-500">
                      {medicine.name}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-primary">
                      {medicine.price} ج.م
                    </div>
                    <div className="text-xs text-slate-500">
                      المخزون: {medicine.stock}
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

interface MedicineNameSearchProps {
  value: string;
  onChange: (value: string) => void;
  onMedicineSelect: (medicine: Medicine) => void;
}

export function MedicineNameSearch({
  value,
  onChange,
  onMedicineSelect,
}: MedicineNameSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedMedicine = medicines.find((m) => m.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full h-8 justify-between text-left font-normal border-none focus-visible:ring-1"
        >
          {selectedMedicine ? (
            <div className="flex items-center gap-2">
              <Package size={14} className="text-slate-500" />
              <span className="text-xs font-medium">
                {selectedMedicine.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              <span className="text-xs text-slate-400">
                ابحث عن اسم الدواء...
              </span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="ابحث باسم الدواء أو الكود..."
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
                  value={medicine.name}
                  onSelect={() => {
                    onChange(medicine.name);
                    onMedicineSelect(medicine);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-3 p-2 cursor-pointer"
                >
                  <Package size={16} className="text-slate-500" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{medicine.name}</div>
                    <div className="text-xs text-slate-500">
                      الكود: {medicine.id}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-primary">
                      {medicine.price} ج.م
                    </div>
                    <div className="text-xs text-slate-500">
                      المخزون: {medicine.stock}
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
