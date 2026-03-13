import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { RoleCardWithDialogs } from "../features/roles-permissions/components/ui/role-card";
import { AddRoleDialog } from "../features/roles-permissions/components/dialog/add-role-dialog";
import { useRoles } from "../features/roles-permissions/hooks/use-roles";
import { Shield, Users, Settings, Crown, AlertCircle } from "lucide-react";
import type { RoleCard as RoleCardType } from "../features/roles-permissions/types";
import type { RoleFormData } from "../features/roles-permissions/components/form/add-role-form";

export function RolesPermissionsPage() {
  const { roles, isLoading, error } = useRoles();

  const handleRoleUpdated = (updatedRole: RoleCardType) => {
    console.log("Role updated:", updatedRole);
    // Here you would typically update the roles list or call an API
  };

  const handleRoleAdded = (roleData: RoleFormData) => {
    console.log("New role added:", roleData);
    // Here you would typically refresh the roles list or update state
  };

  const totalRoles = roles.length;
  const totalUsers = roles.reduce(
    (sum, role) => sum + (role.userCount || 0),
    0,
  );
  const totalPermissions = roles.reduce(
    (sum, role) => sum + role.definition.permissions.length,
    0,
  );

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <div className="bg-red-100 rounded-full p-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-800">حدث خطأ</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-10">
        <PageHeader
          title="الأدوار والصلاحيات"
          description="إدارة أدوار المستخدمين وصلاحيات الوصول في النظام"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    إجمالي الأدوار
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalRoles}
                  </p>
                </div>
                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    إجمالي المستخدمين
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalUsers}
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    إجمالي الصلاحيات
                  </p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {totalPermissions}
                  </p>
                </div>
                <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    متوسط الصلاحيات
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalRoles > 0
                      ? Math.round(totalPermissions / totalRoles)
                      : 0}
                  </p>
                </div>
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Crown className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              قائمة الأدوار
            </h2>
            <p className="text-gray-600">
              إدارة وتكوين أدوار المستخدمين في النظام
            </p>
          </div>
          <AddRoleDialog onRoleAdded={handleRoleAdded} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {roles.map((role) => (
              <RoleCardWithDialogs
                key={role.code}
                role={role}
                onRoleUpdated={handleRoleUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
