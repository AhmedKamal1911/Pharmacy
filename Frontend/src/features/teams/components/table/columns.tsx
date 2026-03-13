import type { ColumnDef } from "@tanstack/react-table";
import type { User, UserStatus } from "../../types";
import { UserStatusBadge, UserRoleBadge } from "../ui/user-badge";
import { UserActions } from "./user-actions";

export const createColumns = (
  currentUser: User,
  onView?: (user: User) => void,
  onEdit?: (user: User) => void,
  onDelete?: (user: User) => void,
  onDeactivate?: (user: User) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: () => <div className="text-start">اسم المستخدم</div>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const email = row.original.email;
      return (
        <div>
          <div className="font-medium">{name || "غير محدد"}</div>
          <div className="text-sm text-muted-foreground">{email}</div>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const name = row.getValue<string>(columnId);
      const email = row.original.email;
      if (!filterValue) return true;
      return (
        name?.toLowerCase().includes(filterValue.toLowerCase()) ||
        email.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="text-start">البريد الإلكتروني</div>,
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("email")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<string>(columnId);
      if (!filterValue) return true;
      return value.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-start">رقم الهاتف</div>,
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return (
        <div className="text-sm">
          {phone || <span className="text-muted-foreground">غير متوفر</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: () => <div className="text-start">دور المستخدم</div>,
    cell: ({ row }) => {
      const roles = row.original.roles?.map((ur) => ur.role.name) || [];
      return <UserRoleBadge roles={roles} />;
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-start">الحالة</div>,
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      const status: UserStatus = isActive ? "active" : "inactive";
      return <UserStatusBadge status={status} />;
    },
    filterFn: (row, _id, value) => {
      if (!value || value === "all") return true;
      const isActive = row.getValue("isActive") as boolean;
      const status: UserStatus = isActive ? "active" : "inactive";
      return status === value;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-start">تاريخ الإضافة</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString("ar-EG")}</div>
          <div className="text-muted-foreground">
            {date.toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="text-start">آخر نشاط</div>,
    cell: ({ row }) => {
      const updatedAtValue = row.getValue("updatedAt") as string | undefined;
      if (!updatedAtValue) {
        return (
          <div className="text-sm">
            <div className="text-muted-foreground">غير متوفر</div>
          </div>
        );
      }

      const date = new Date(updatedAtValue);
      if (isNaN(date.getTime())) {
        return (
          <div className="text-sm">
            <div className="text-muted-foreground">تاريخ غير صالح</div>
          </div>
        );
      }

      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let lastActive = "منذ وقت طويل";
      if (diffDays === 0) {
        lastActive = "اليوم";
      } else if (diffDays === 1) {
        lastActive = "أمس";
      } else if (diffDays <= 7) {
        lastActive = `منذ ${diffDays} أيام`;
      } else if (diffDays <= 30) {
        lastActive = `منذ ${Math.floor(diffDays / 7)} أسابيع`;
      } else {
        lastActive = `منذ ${Math.floor(diffDays / 30)} أشهر`;
      }

      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString("ar-EG")}</div>
          <div className="text-muted-foreground">{lastActive}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "access",
    header: () => <div className="text-start">الوصول</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full me-2 ${
              user.isActive ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span className="text-sm">{user.isActive ? "مفعل" : "معطل"}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-start">الإجراءات</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-start">
          <UserActions
            user={user}
            currentUser={currentUser}
            onView={onView || (() => {})}
            onEdit={onEdit || (() => {})}
            onDelete={onDelete || (() => {})}
            onDeactivate={onDeactivate || (() => {})}
          />
        </div>
      );
    },
  },
];
