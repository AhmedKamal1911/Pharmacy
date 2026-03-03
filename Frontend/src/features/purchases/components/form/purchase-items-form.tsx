import type { PurchaseItem } from "../../types";
import type { Medicine } from "@/data/medicines";
import { AddItemDialog } from "../dialog/add-medicine-dialog";
import { MedicineTable } from "../table/medicine-table/medicine-table";

interface PurchaseItemsFormProps {
  items: PurchaseItem[];
  onAddItem: (newItem: PurchaseItem, newMedicine?: Medicine) => void;
  onUpdateItem: (
    id: string,
    field: keyof PurchaseItem,
    value: string | number | boolean | undefined,
  ) => void;
  onRemoveItem: (id: string) => void;
}

export function PurchaseItemsForm({
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: PurchaseItemsFormProps) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            أصناف الفاتورة
          </h3>
          <p className="text-sm text-slate-500">
            إجمالي الأصناف: {items.length}
          </p>
        </div>

        {/* زر الإضافة والمودال */}
        <AddItemDialog onItemSelect={onAddItem} />
      </div>

      {/* الجدول الجميل بتاعنا */}
      <MedicineTable
        data={items}
        onUpdateItem={onUpdateItem}
        onRemoveItem={onRemoveItem}
      />
    </div>
  );
}
