export type UserStatus = "active" | "inactive" | "deleted";
export type PermissionAction =
  | "USER_CREATE"
  | "USER_READ"
  | "USER_UPDATE"
  | "USER_DELETE"
  | "ROLE_CREATE"
  | "ROLE_READ"
  | "ROLE_UPDATE"
  | "ROLE_DELETE";

export interface User {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  users: UserRole[];
  permissions: RolePermission[];
}

export interface Permission {
  id: string;
  action: PermissionAction;
  description?: string;
  roles: RolePermission[];
}

export interface UserRole {
  user: User;
  userId: string;
  role: Role;
  roleId: string;
}

export interface RolePermission {
  role: Role;
  roleId: string;
  permission: Permission;
  permissionId: string;
}

export interface UserFilters {
  search?: string;
  status?: UserStatus;
  role?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateUserRequest {
  name?: string;
  email: string;
  phone?: string;
  password: string;
  roleIds: string[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  roleIds?: string[];
}
