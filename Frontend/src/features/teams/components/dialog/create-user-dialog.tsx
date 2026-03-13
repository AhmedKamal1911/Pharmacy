import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateUserForm } from "../form/create-user-form";
import type { CreateUserRequest } from "../../types";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (userData: CreateUserRequest) => Promise<void>;
  isCreating?: boolean;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onCreateUser,
  isCreating = false,
}: CreateUserDialogProps) {
  const handleSubmit = async (userData: CreateUserRequest) => {
    await onCreateUser(userData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader className="pt-4">
          <DialogTitle className="flex items-center gap-2">
            إضافة مستخدم جديد
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pe-4 py-2">
          <CreateUserForm onSubmit={handleSubmit} isLoading={isCreating} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
