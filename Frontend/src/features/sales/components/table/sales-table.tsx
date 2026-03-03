"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MedicineVariantSearch,
  MedicineNameVariantSearch,
} from "./medicine-variant-search";
import { medicines } from "@/data/medicines";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { SaleFormValues } from "../form/sale-form";

interface SalesTableProps {
  fields: Array<{ id: string; [key: string]: unknown }>;
  form: UseFormReturn<SaleFormValues>;
  remove: (index: number) => void;
}

export default function SalesTable({ fields, form, remove }: SalesTableProps) {
  const items = useWatch({
    control: form.control,
    name: "items",
  });

  const tableRows = useMemo(
    () =>
      fields.map((field, index) => {
        // حسابات الإجمالي للصف الواحد
        const item = items[index];
        const qty = item?.quantity || 0;
        const prc = item?.price || 0;
        const dsc = item?.discount || 0;
        const vt = item?.vat || 0;
        const medicineId = item?.medicineId || "";
        const selectedMedicine = medicines.find((m) =>
          m.variants.some((v) => v.id === medicineId),
        );
        const selectedVariant = selectedMedicine?.variants.find(
          (v) => v.id === medicineId,
        );

        const lineTotal = qty * prc - qty * prc * (dsc / 100) + vt;

        return (
          <TableRow key={field.id} className="h-12 hover:bg-slate-50">
            {/* الكود */}
            <TableCell className="p-1 border">
              <MedicineVariantSearch
                value={item?.medicineId || ""}
                onChange={(value) => {
                  form.setValue(`items.${index}.medicineId`, value);
                }}
                onMedicineSelect={(medicine, variant) => {
                  form.setValue(`items.${index}.medicineName`, medicine.name);
                  form.setValue(`items.${index}.price`, variant.price);
                  form.setValue(
                    `items.${index}.expiryDate`,
                    variant.expiryDate || "",
                  );
                }}
              />
            </TableCell>

            {/* اسم الصنف */}
            <TableCell className="p-1 border text-right">
              <MedicineNameVariantSearch
                value={item?.medicineName || ""}
                onChange={(value) => {
                  form.setValue(`items.${index}.medicineName`, value);
                }}
                onMedicineSelect={(medicine, variant) => {
                  form.setValue(`items.${index}.medicineId`, variant.id);
                  form.setValue(`items.${index}.price`, variant.price);
                  form.setValue(
                    `items.${index}.expiryDate`,
                    variant.expiryDate || "",
                  );
                }}
              />
            </TableCell>

            {/* الكمية */}
            <TableCell className="p-1 border">
              <Input
                type="number"
                {...form.register(`items.${index}.quantity`, {
                  valueAsNumber: true,
                })}
                className="h-8 border-none text-center"
              />
            </TableCell>

            {/* الوحدة (عبوة / شريط / قطعة) */}
            <TableCell className="p-1 border">
              <select
                {...form.register(`items.${index}.unitType`)}
                className="w-full h-8 bg-transparent text-sm border-none focus:ring-0 outline-none"
              >
                <option value="pack">علبة كامله</option>
                <option value="strip">شريط</option>
                <option value="piece">قطعة/قرص</option>
              </select>
            </TableCell>

            {/* السعر */}
            <TableCell className="p-1 border">
              <Input
                type="number"
                {...form.register(`items.${index}.price`, {
                  valueAsNumber: true,
                })}
                className="h-8 border-none text-center"
              />
            </TableCell>

            {/* الخصم */}
            <TableCell className="p-1 border">
              <Input
                type="number"
                {...form.register(`items.${index}.discount`, {
                  valueAsNumber: true,
                })}
                className="h-8 border-none text-center text-red-600"
              />
            </TableCell>

            {/* الصلاحية */}
            <TableCell className="p-1 border">
              <Input
                type="text"
                placeholder="لا يوجد صلاحية"
                value={selectedVariant?.expiryDate || ""}
                className="h-8 border-none text-center text-xs bg-gray-50 cursor-default select-none"
                readOnly
              />
            </TableCell>

            {/* VAT */}
            <TableCell className="p-1 border">
              <Input
                type="number"
                {...form.register(`items.${index}.vat`, {
                  valueAsNumber: true,
                })}
                className="h-8 border-none text-center"
              />
            </TableCell>

            {/* الإجمالي */}
            <TableCell className="p-1 border text-center font-bold bg-slate-50 text-primary">
              {lineTotal.toFixed(2)}
            </TableCell>

            {/* حذف */}
            <TableCell className="p-1 border text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={14} />
              </Button>
            </TableCell>
          </TableRow>
        );
      }),
    [fields, items, form, remove],
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <Table className="border-collapse border-spacing-0">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[120px] border text-center">
              الكود
            </TableHead>
            <TableHead className="min-w-[200px] border text-right">
              اسم الصنف
            </TableHead>
            <TableHead className="w-[100px] border text-center">
              الكمية
            </TableHead>
            <TableHead className="w-[120px] border text-center">
              الوحدة
            </TableHead>
            <TableHead className="w-[100px] border text-center">
              السعر
            </TableHead>
            <TableHead className="w-[80px] border text-center">خصم %</TableHead>
            <TableHead className="w-[120px] border text-center">
              الصلاحية
            </TableHead>
            <TableHead className="w-[80px] border text-center">VAT</TableHead>
            <TableHead className="w-[120px] border text-center font-bold">
              الإجمالي
            </TableHead>
            <TableHead className="w-[50px] border"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </div>
  );
}
