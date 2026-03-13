import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import type { RoleCard as RoleCardType } from "../../types";
import type { EditRoleFormData } from "../form/edit-role-form";
import { RoleDetailsDialog } from "../dialog/role-details-dialog";
import { EditRoleDialog } from "../dialog/edit-role-dialog";
import { DeleteRoleDialog } from "../dialog/delete-role-dialog";
import type {
  RoleCode,
  PermissionKey,
  RoleDefinition,
} from "@/data/roles-permissions";
import { ROLES } from "@/data/roles-permissions";

interface RoleCardProps {
  role: RoleCardType;
  onViewRole?: (role: RoleCardType) => void;
  onEditRole?: (role: RoleCardType) => void;
  onDeleteRole?: (role: RoleCardType) => void;
}

interface RoleCardWithDialogsProps {
  role: RoleCardType;
  onRoleUpdated?: (role: RoleCardType) => void;
  onRoleDeleted?: (role: RoleCardType) => void;
}

// Pure component - only displays the card, no dialog state
export function RoleCard({
  role,
  onViewRole,
  onEditRole,
  onDeleteRole,
}: RoleCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-gray-200 bg-gray-50 py-3">
      <CardContent className="p-4 py-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-lg">
                {role.definition.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {role.code}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              {role.definition.description}
            </p>
            <div className="text-sm text-gray-500">
              {role.definition.permissions.length} صلاحية
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewRole && onViewRole(role)}
              className="px-3 py-1 text-xs"
            >
              <Eye className="h-3 w-3 ml-1" />
              عرض
            </Button>

            {role.code !== "SUPER_ADMIN" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditRole && onEditRole(role)}
                  className="px-3 py-1 text-xs"
                >
                  <Settings className="h-3 w-3 ml-1" />
                  تعديل
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteRole && onDeleteRole(role)}
                  className="px-3 py-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3 ml-1" />
                  حذف
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Wrapper component that manages dialog state
export function RoleCardWithDialogs({
  role,
  onRoleUpdated,
  onRoleDeleted,
}: RoleCardWithDialogsProps) {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleRoleUpdated = (updatedData: EditRoleFormData) => {
    if (onRoleUpdated) {
      // Create the new role definition using type assertion to handle the union type
      const newDefinition = {
        name: updatedData.roleName,
        nameEn: ROLES[updatedData.roleCode as RoleCode].nameEn,
        description: ROLES[updatedData.roleCode as RoleCode].description,
        permissions: updatedData.permissions as PermissionKey[],
      } as const;

      onRoleUpdated({
        ...role,
        code: updatedData.roleCode as RoleCode,
        definition: newDefinition as RoleDefinition,
      });
    }
  };

  return (
    <>
      <RoleCard
        role={role}
        onViewRole={() => setDetailsDialogOpen(true)}
        onEditRole={() => setEditDialogOpen(true)}
        onDeleteRole={() => setDeleteDialogOpen(true)}
      />

      <RoleDetailsDialog
        role={role}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      <EditRoleDialog
        role={role}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onRoleUpdated={handleRoleUpdated}
      />

      <DeleteRoleDialog
        role={role}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onRoleDeleted={onRoleDeleted}
      />
    </>
  );
}
