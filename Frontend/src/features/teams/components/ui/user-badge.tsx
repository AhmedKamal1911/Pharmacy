import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "../../types";

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case "active":
        return {
          label: "نشط",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "inactive":
        return {
          label: "غير نشط",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
      case "deleted":
        return {
          label: "محذوف",
          className: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

interface UserRoleBadgeProps {
  roles: string[];
  maxDisplay?: number;
}

export function UserRoleBadge({ roles, maxDisplay = 2 }: UserRoleBadgeProps) {
  if (!roles || roles.length === 0) {
    return <Badge variant="outline">لا يوجد أدوار</Badge>;
  }

  const displayRoles = roles.slice(0, maxDisplay);
  const remainingCount = roles.length - maxDisplay;

  return (
    <div className="flex flex-wrap gap-1">
      {displayRoles.map((role, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {role}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}
