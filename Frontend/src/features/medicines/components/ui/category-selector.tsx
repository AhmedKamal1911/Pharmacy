import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Category {
  value: string;
  label: string;
}

interface CategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  includeAllOption?: boolean;
}

const defaultCategories: Category[] = [
  { value: "all", label: "كل الفئات" },
  { value: "مسكنات", label: "مسكنات" },
  { value: "مضادات حيوية", label: "مضادات حيوية" },
  { value: "فيتامينات", label: "فيتامينات" },
  { value: "مكملات غذائية", label: "مكملات غذائية" },
  { value: "أدوية قلبية", label: "أدوية قلبية" },
  { value: "أدوية سكرية", label: "أدوية سكرية" },
  { value: "أدوية ضغط", label: "أدوية ضغط" },
  { value: "مستحضرات جلدية", label: "مستحضرات جلدية" },
  { value: "أدوية تنفسية", label: "أدوية تنفسية" },
  { value: "أخرى", label: "أخرى" },
];

export function CategorySelector({
  value,
  onValueChange,
  placeholder = "الفئة",
  className = "h-9 w-full justify-between text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white rounded-md",
  includeAllOption = true,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);

  const categories = includeAllOption
    ? defaultCategories
    : defaultCategories.filter((cat) => cat.value !== "all");

  const currentCategory =
    categories.find((cat) => cat.value === value)?.label || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className={className}>
          {currentCategory}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="ابحث عن فئة..." className="h-9" />
          <CommandList>
            <CommandEmpty>لا توجد فئات مطابقة</CommandEmpty>
            <CommandGroup>
              {defaultCategories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {category.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
