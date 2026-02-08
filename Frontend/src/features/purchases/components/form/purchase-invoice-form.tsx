import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
          <Select value={supplierId} onValueChange={onSupplierChange}>
            <SelectTrigger>
              <SelectValue placeholder="اختر المورد" />
            </SelectTrigger>
            <SelectContent>
              {mockSuppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
