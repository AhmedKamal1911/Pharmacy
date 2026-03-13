import { useMemo } from "react";
import { ROLE_CODES, ROLES, PERMISSION_GROUPS } from "@/data/roles-permissions";
import type { RoleCard } from "../types";

// Mock user counts for demonstration
const MOCK_USER_COUNTS: Record<keyof typeof ROLE_CODES, number> = {
  SUPER_ADMIN: 1,
  ADMIN: 3,
  SALES: 8,
};

export function useRoles() {
  const roles = useMemo<RoleCard[]>(() => {
    return Object.entries(ROLES).map(([code, definition]) => ({
      code: code as keyof typeof ROLE_CODES,
      definition,
      userCount: MOCK_USER_COUNTS[code as keyof typeof ROLE_CODES] || 0,
    }));
  }, []);

  const getRoleByCode = (code: keyof typeof ROLE_CODES) => {
    return roles.find((role) => role.code === code);
  };

  const getPermissionsByGroup = (roleCode: keyof typeof ROLE_CODES) => {
    const role = ROLES[roleCode];
    if (!role) return {};

    const groupedPermissions: Record<string, typeof role.permissions> = {};

    Object.entries(PERMISSION_GROUPS).forEach(([groupKey, group]) => {
      groupedPermissions[groupKey] = group.permissions.filter((permission) =>
        role.permissions.includes(permission),
      );
    });

    return groupedPermissions;
  };

  return {
    roles,
    getRoleByCode,
    getPermissionsByGroup,
    isLoading: false,
    error: null,
  };
}
