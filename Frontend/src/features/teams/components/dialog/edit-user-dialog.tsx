import * as React from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { EditUserForm, type EditUserFormData } from "../form/edit-user-form";
import type { User, UpdateUserRequest } from "../../types";
import { ROLE_CODES } from "@/data/roles-permissions";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated?: (user: User) => void;
  currentUser?: User; // Current logged-in user context
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
  currentUser,
}: EditUserDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: EditUserFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // RBAC Protection: Ensure Super Admin protection is enforced
      const isEditingSuperAdmin = user.roles.some(
        (role) => role.roleId === ROLE_CODES.SUPER_ADMIN,
      );

      let updateRequest: UpdateUserRequest = {};

      if (isEditingSuperAdmin) {
        // For Super Admin: Only allow basic profile updates
        updateRequest = {
          name: data.name !== user.name ? data.name : undefined,
          email: data.email !== user.email ? data.email : undefined,
          phone: data.phone !== user.phone ? data.phone : undefined,
          // Force Super Admin protection
          isActive: true,
          roleIds: [ROLE_CODES.SUPER_ADMIN],
        };
      } else {
        // For regular users: Allow all updates with mutual exclusivity enforced
        updateRequest = {
          name: data.name !== user.name ? data.name : undefined,
          email: data.email !== user.email ? data.email : undefined,
          phone: data.phone !== user.phone ? data.phone : undefined,
          isActive: data.isActive !== user.isActive ? data.isActive : undefined,
          roleIds:
            data.roleIds && data.roleIds.length > 0 ? data.roleIds : undefined,
        };
      }

      // Remove undefined values
      Object.keys(updateRequest).forEach((key) => {
        if (updateRequest[key as keyof UpdateUserRequest] === undefined) {
          delete updateRequest[key as keyof UpdateUserRequest];
        }
      });

      // Create updated user object
      const updatedUser: User = {
        ...user,
        ...updateRequest,
        updatedAt: new Date().toISOString(),
        // Note: In a real app, you'd handle roles differently based on API response
        roles: isEditingSuperAdmin
          ? user.roles // Keep existing Super Admin roles
          : user.roles, // Keep existing roles for now (would be updated by API)
      };

      // Call the callback if provided
      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      toast.success("تم تحديث المستخدم بنجاح!", {
        description: `تم تحديث بيانات ${updatedUser.name || updatedUser.email} بنجاح.`,
      });

      onOpenChange(false);
    } catch {
      toast.error("فشل في تحديث المستخدم", {
        description: "حدث خطأ أثناء تحديث المستخدم. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert user data to form format
  const defaultValues = user
    ? {
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
        isActive: user.isActive,
        roleIds: user.roles.map((role) => role.roleId),
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
          <DialogDescription>
            يرجى تعديل بيانات المستخدم أدناه وتحديث المعلومات المطلوبة.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="pe-4">
            {user && (
              <EditUserForm
                initialData={defaultValues}
                currentUser={currentUser}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
