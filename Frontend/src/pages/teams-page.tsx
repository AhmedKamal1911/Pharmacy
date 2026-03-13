import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { UsersTableWithFilters } from "../features/teams/components/table/users-table-with-filters";
import { createColumns } from "../features/teams/components/table/columns";
import type {
  User,
  UserStatus,
  CreateUserRequest,
} from "../features/teams/types";
import { CreateUserDialog } from "../features/teams/components/dialog/create-user-dialog";
import { ViewUserDialog } from "../features/teams/components/dialog/view-user-dialog";
import { EditUserDialog } from "../features/teams/components/dialog/edit-user-dialog";
import { useTeams } from "../features/teams/hooks/use-teams";
import { Users, UserCheck, UserX, Shield } from "lucide-react";
import { toast } from "sonner";

export function TeamsPage() {
  const {
    users,
    isLoading,
    error,
    createUser,
    deleteUser,

    isCreating,
  } = useTeams();

  // Mock current user (Super Admin) - in real app this would come from auth context
  const currentUser: User = {
    id: "1",
    name: "مدير النظام",
    email: "admin@pharmacy.com",
    phone: "+966 50 123 4567",
    isActive: true,
    createdAt: "2024-01-01T09:00:00Z",
    updatedAt: "2025-03-13T10:30:00Z",
    roles: [
      {
        id: "1",
        userId: "1",
        roleId: "SUPER_ADMIN",
        user: {
          id: "1",
          name: "مدير النظام",
          email: "admin@pharmacy.com",
          isActive: true,
          createdAt: "2024-01-01T09:00:00Z",
          updatedAt: "2025-03-13T10:30:00Z",
          roles: [],
        },
        role: {
          id: "SUPER_ADMIN",
          name: "SUPER_ADMIN",
          description: "مدير النظام",
          users: [],
          permissions: [],
        },
      },
    ],
  };

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (
      window.confirm(`هل أنت متأكد من حذف المستخدم ${user.name || user.email}؟`)
    ) {
      try {
        await deleteUser(user.id);
        toast.success("تم حذف المستخدم بنجاح");
      } catch {
        toast.error("حدث خطأ أثناء حذف المستخدم");
      }
    }
  };

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      await createUser(userData);
      toast.success("تم إضافة المستخدم الجديد بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء إضافة المستخدم الجديد");
    }
  };

  const handleUserUpdated = (_updatedUser: User) => {
    // In a real app, this would update the user in the cache or refetch data
    // Toast is already shown in the dialog component
  };

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          (user.name &&
            user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => {
        const status = user.isActive ? "active" : "inactive";
        return status === statusFilter;
      });
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) =>
        user.roles?.some((ur) => ur.role.name === roleFilter),
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((user) => {
        const createdDate = new Date(user.createdAt);

        switch (dateFilter) {
          case "today":
            return createdDate >= today;
          case "week": {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createdDate >= weekAgo;
          }
          case "month": {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return createdDate >= monthAgo;
          }
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [users, searchQuery, statusFilter, roleFilter, dateFilter]);

  const totalActiveUsers = filteredUsers.filter((user) => user.isActive).length;
  const totalInactiveUsers = filteredUsers.filter(
    (user) => !user.isActive,
  ).length;
  const totalAdminUsers = filteredUsers.filter((user) =>
    user.roles?.some((ur) => ur.role.name === "admin"),
  ).length;

  const handleDeactivateUser = async (user: User) => {
    try {
      // In a real app, you would call an API to toggle user status
      // await toggleUserStatus(user.id, !user.isActive);
      toast.success(
        `تم ${user.isActive ? "إلغاء تفعيل" : "تفعيل"} المستخدم بنجاح`,
      );
    } catch {
      toast.error("حدث خطأ أثناء تحديث حالة المستخدم");
    }
  };

  const columns = createColumns(
    currentUser,
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
    handleDeactivateUser,
  );

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <div className="bg-red-100 rounded-full p-2">
            <UserX className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-800">حدث خطأ</h3>
            <p className="text-red-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-10">
        <PageHeader
          title="إدارة الفريق"
          description="إدارة أعضاء الفريق وصلاحيات الوصول إلى النظام"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    إجمالي المستخدمين
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {filteredUsers.length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    المستخدمين النشطين
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalActiveUsers}
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    المستخدمين غير النشطين
                  </p>
                  <p className="text-2xl font-bold text-gray-600">
                    {totalInactiveUsers}
                  </p>
                </div>
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <UserX className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">المديرين</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {totalAdminUsers}
                  </p>
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Table with integrated filters - matching returns page structure */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <UsersTableWithFilters
          data={filteredUsers}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          roleFilter={roleFilter}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onRoleChange={setRoleFilter}
          allData={users}
          isLoading={isLoading}
          columns={columns}
          onCreateUser={() => setIsCreateDialogOpen(true)}
        />
      </div>

      {/* Create User Modal */}
      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateUser={handleCreateUser}
        isCreating={isCreating}
      />

      {/* View User Modal */}
      <ViewUserDialog
        user={selectedUser}
        open={isViewDialogOpen}
        onOpenChange={(open) => {
          setIsViewDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}
      />

      {/* Edit User Modal */}
      <EditUserDialog
        user={selectedUser}
        currentUser={currentUser}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}
