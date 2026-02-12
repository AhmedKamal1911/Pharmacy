import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { mockSuppliers } from "@/features/suppliers/api/mock-data";

interface AddInvoiceFormProps {
  supplierId: string;
  notes: string;
  onSupplierChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export function AddInvoiceForm({
  supplierId,
  notes,
  onSupplierChange,
  onNotesChange,
}: AddInvoiceFormProps) {
  const selectedSupplier = mockSuppliers.find((s) => s.id === supplierId);
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">
          بيانات الفاتورة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="supplier">المورد</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                {selectedSupplier ? selectedSupplier.name : "اختر المورد"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command className="max-h-60">
                <CommandInput placeholder="ابحث عن مورد..." />
                <CommandGroup className="max-h-40 overflow-y-auto">
                  {mockSuppliers.map((supplier) => (
                    <CommandItem
                      key={supplier.id}
                      onSelect={() => {
                        onSupplierChange(supplier.id);
                        setOpen(false);
                      }}
                      className="flex cursor-pointer items-center py-2"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          supplierId === supplier.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {supplier.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandEmpty>لا يوجد مورد بهذا الاسم</CommandEmpty>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {selectedSupplier && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700">
                {selectedSupplier.short}
              </Badge>
              <span className="text-sm text-slate-600">
                {selectedSupplier.supplierType === "COMPANY"
                  ? "شركة"
                  : selectedSupplier.supplierType === "WAREHOUSE"
                    ? "مستودع"
                    : "شخص"}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">ملاحظات</Label>
          <Input
            id="notes"
            placeholder="ملاحظات على الفاتورة"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
