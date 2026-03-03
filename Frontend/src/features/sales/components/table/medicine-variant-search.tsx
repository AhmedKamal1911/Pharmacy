"use client";

import { useState } from "react";
import { Package, Calendar, DollarSign } from "lucide-react";
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
import { medicines, type Medicine, type MedicineVariant } from "@/data/medicines";

interface MedicineVariantSearchProps {
  value: string;
  onChange: (value: string) => void;
  onMedicineSelect: (medicine: Medicine, variant: MedicineVariant) => void;
}

export function MedicineVariantSearch({
  value,
  onChange,
  onMedicineSelect,
}: MedicineVariantSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Find selected medicine and variant
  const selectedMedicine = medicines.find((m) => 
    m.variants.some(v => v.id === value)
  );
  const selectedVariant = selectedMedicine?.variants.find(v => v.id === value);

  const handleVariantSelect = (medicine: Medicine, variant: MedicineVariant) => {
    onChange(variant.id);
    onMedicineSelect(medicine, variant);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full h-8 justify-between text-left font-normal border-none focus-visible:ring-1"
        >
          {selectedVariant ? (
            <div className="flex items-center gap-2">
              <Package size={14} className="text-slate-500" />
              <span className="text-xs">{selectedMedicine?.id}</span>
              {selectedMedicine && selectedMedicine.variants.length > 1 && (
                <span className="text-xs text-blue-600 font-medium">
                  ({selectedVariant.price} ج.م)
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Package size={14} className="text-slate-400" />
              <span className="text-xs text-slate-400">ابحث عن دواء...</span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
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
                <div key={medicine.id}>
                  {/* Medicine header */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 sticky top-0">
                    {medicine.id} - {medicine.name}
                  </div>
                  {/* Variants */}
                  {medicine.variants.map((variant) => (
                    <CommandItem
                      key={variant.id}
                      value={variant.id}
                      onSelect={() => handleVariantSelect(medicine, variant)}
                      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50"
                    >
                      <Package size={16} className="text-slate-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{variant.id}</span>
                          {variant.batchNumber && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              {variant.batchNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          {variant.expiryDate && (
                            <div className="flex items-center gap-1">
                              <Calendar size={10} />
                              <span>صلاحية: {variant.expiryDate}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <span>المخزون: {variant.stock}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-primary flex items-center gap-1">
                          <DollarSign size={12} />
                          {variant.price} ج.م
                        </div>
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

interface MedicineNameVariantSearchProps {
  value: string;
  onChange: (value: string) => void;
  onMedicineSelect: (medicine: Medicine, variant: MedicineVariant) => void;
}

export function MedicineNameVariantSearch({
  value,
  onChange,
  onMedicineSelect,
}: MedicineNameVariantSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Find selected medicine and variant
  const selectedMedicine = medicines.find((m) => 
    m.variants.some(v => v.id === value)
  );
  const selectedVariant = selectedMedicine?.variants.find(v => v.id === value);

  const handleVariantSelect = (medicine: Medicine, variant: MedicineVariant) => {
    onChange(medicine.name);
    onMedicineSelect(medicine, variant);
    setOpen(false);
    setSearchTerm("");
  };

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
              {selectedMedicine.variants.length > 1 && (
                <span className="text-xs text-blue-600 font-medium">
                  ({selectedVariant?.price} ج.م)
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Package size={14} className="text-slate-400" />
              <span className="text-xs text-slate-400">
                ابحث عن اسم الدواء...
              </span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
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
                <div key={medicine.id}>
                  {/* Medicine header */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 sticky top-0">
                    {medicine.name} ({medicine.id})
                  </div>
                  {/* Variants */}
                  {medicine.variants.map((variant) => (
                    <CommandItem
                      key={variant.id}
                      value={variant.id}
                      onSelect={() => handleVariantSelect(medicine, variant)}
                      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50"
                    >
                      <Package size={16} className="text-slate-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{medicine.name}</span>
                          {variant.batchNumber && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              {variant.batchNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <div className="flex items-center gap-1">
                            <span>الكود: {medicine.id}</span>
                          </div>
                          {variant.expiryDate && (
                            <div className="flex items-center gap-1">
                              <Calendar size={10} />
                              <span>صلاحية: {variant.expiryDate}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <span>المخزون: {variant.stock}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-primary flex items-center gap-1">
                          <DollarSign size={12} />
                          {variant.price} ج.م
                        </div>
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
