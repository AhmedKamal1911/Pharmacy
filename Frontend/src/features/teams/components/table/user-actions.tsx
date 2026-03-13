import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, UserX } from "lucide-react";
import type { User } from "../../types";
import { ROLE_CODES } from "@/data/roles-permissions";
import { UserActionDialog } from "../dialog/user-action-dialog";

interface UserActionsProps {
  user: User;
  currentUser: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onDeactivate?: (user: User) => void;
}

export function UserActions({
  user,
  currentUser,
  onView,
  onEdit,
  onDelete,
  onDeactivate,
}: UserActionsProps) {
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  // Check current user permissions
  const currentUserRoles = currentUser.roles.map((r) => r.roleId);
  const isCurrentUserSuperAdmin = currentUserRoles.includes(
    ROLE_CODES.SUPER_ADMIN,
  );
  const isCurrentUserAdmin = currentUserRoles.includes(ROLE_CODES.ADMIN);

  // Check target user roles
  const targetUserRoles = user.roles.map((r) => r.roleId);
  const isTargetUserSuperAdmin = targetUserRoles.includes(
    ROLE_CODES.SUPER_ADMIN,
  );

  // RBAC Permission Logic
  const canEdit =
    isCurrentUserSuperAdmin || (isCurrentUserAdmin && !isTargetUserSuperAdmin);

  const canDelete = isCurrentUserSuperAdmin && !isTargetUserSuperAdmin;

  return (
    <>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">فتح القائمة</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        {/* Changed align to start for RTL layouts so it doesn't clip off-screen */}
        <DropdownMenuContent align="end" className="w-48 font-medium">
          <DropdownMenuItem
            onClick={() => onView(user)}
            className="cursor-pointer flex items-center gap-2.5 py-2"
          >
            <Eye className="h-4 w-4 text-blue-500" />
            <span>عرض التفاصيل</span>
          </DropdownMenuItem>

          {canEdit && (
            <DropdownMenuItem
              onClick={() => onEdit(user)}
              className="cursor-pointer flex items-center gap-2.5 py-2"
            >
              <Edit className="h-4 w-4 text-amber-500" />
              <span>تعديل البيانات</span>
            </DropdownMenuItem>
          )}

          {canEdit && canDelete && <DropdownMenuSeparator className="my-1" />}

          {canDelete && (
            <DropdownMenuItem
              onClick={() => setActionDialogOpen(true)}
              className="cursor-pointer flex items-center gap-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors"
            >
              <UserX className="h-4 w-4" />
              <span>إجراءات الحساب</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Action Dialog */}
      <UserActionDialog
        user={user}
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        onDeactivate={onDeactivate || (() => {})}
        onDelete={onDelete}
      />
    </>
  );
}
