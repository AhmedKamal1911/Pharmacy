import type { RoleCode, RoleDefinition, PermissionGroup } from "@/data/roles-permissions";

export interface RoleCard {
  code: RoleCode;
  definition: RoleDefinition;
  userCount?: number;
}

export interface RolePermissionsDialogProps {
  role: RoleCard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type { RoleCode, RoleDefinition, PermissionGroup };
