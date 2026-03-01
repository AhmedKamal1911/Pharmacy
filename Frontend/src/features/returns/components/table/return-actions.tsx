import { useState } from "react";
import { MoreHorizontal, Eye, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ReturnInvoice } from "../../types";
import { ViewReturnDialog } from "../dialog/view-return-dialog";

interface ReturnActionsProps {
  returnInvoice: ReturnInvoice;
  onView?: (returnInvoice: ReturnInvoice) => void;
}

export function ReturnActions({ returnInvoice, onView }: ReturnActionsProps) {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleView = () => {
    if (onView) {
      onView(returnInvoice);
    } else {
      setViewDialogOpen(true);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">فتح القائمة</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleView}>
            <Eye className="ml-2 h-4 w-4" />
            عرض التفاصيل
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="ml-2 h-4 w-4" />
            طباعة الفاتورة
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Dialog */}
      <ViewReturnDialog
        returnInvoice={returnInvoice}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </>
  );
}
