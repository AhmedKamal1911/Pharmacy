import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Settings2 } from "lucide-react";
import {
  PERMISSION_GROUPS,
  formatPermissionName,
} from "@/data/roles-permissions";
import type { RoleCard } from "../../types";
import type { PermissionKey } from "@/data/roles-permissions";

interface RoleDetailsDialogProps {
  role: RoleCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleDetailsDialog({
  role,
  open,
  onOpenChange,
}: RoleDetailsDialogProps) {
  if (!role) return null;

  const groupedPermissions = Object.entries(PERMISSION_GROUPS)
    .map(([key, group]) => {
      const rolePermissions = role.definition.permissions.filter(
        (permission: PermissionKey) => group.permissions.includes(permission),
      );
      return {
        key,
        title: group.title,
        titleEn: group.titleEn,
        permissions: rolePermissions,
      };
    })
    .filter((group) => group.permissions.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[95vh] max-md:h-[90vh] p-0 flex flex-col"
        style={{ width: "90vw", maxWidth: "700px" }}
        dir="rtl"
      >
        <DialogHeader className="px-6 pt-10 pb-2 shrink-0">
          <div className="flex items-start gap-4">
            {/* الأيقونة */}
            <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-sm shrink-0">
              <Shield className="h-6 w-6" />
            </div>

            {/* النصوص */}
            <div className="flex-1 pt-1">
              {/* العنوان والبادج */}
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-2xl font-bold text-foreground leading-none">
                  {role.definition.name}
                </DialogTitle>
                <Badge
                  variant="secondary"
                  className="font-mono text-xs uppercase tracking-wider"
                >
                  {role.code}
                </Badge>
              </div>

              {/* الوصف */}
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed w-fit">
                {role.definition.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="pt-2 px-6 pb-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-muted/40 border border-border/50 text-center">
              <span className="text-3xl font-black text-primary">
                {role.definition.permissions.length}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                إجمالي الصلاحيات
              </span>
            </div>
            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-muted/40 border border-border/50 text-center">
              <span className="text-3xl font-black text-primary">
                {groupedPermissions.length}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                الوحدات النشطة
              </span>
            </div>
            <div className="flex flex-col gap-1 p-5 rounded-2xl bg-muted/40 border border-border/50 text-center">
              <span className="text-3xl font-black text-primary">
                {role.userCount || 0}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                عدد المستخدمين
              </span>
            </div>
          </div>

          {/* Permissions List */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              تفاصيل الصلاحيات
            </h3>

            <ScrollArea className="h-96 w-full border rounded-lg p-4 pe-3">
              <div className="space-y-3 ">
                {groupedPermissions.map((group) => (
                  <div
                    key={group.key}
                    className="border border-border/60 rounded-2xl bg-card"
                  >
                    <div className="bg-muted px-4 py-3 border-b border-border/60">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-foreground">
                          {group.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="bg-muted text-muted-foreground font-bold px-2.5 py-0.5 rounded-full"
                        >
                          {group.permissions.length}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {group.permissions.map((permission: string) => (
                          <div
                            key={permission}
                            className="flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/50 transition-colors"
                          >
                            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                            <span className="text-sm font-medium text-foreground leading-relaxed">
                              {formatPermissionName(permission)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* System Info Footer */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/30 border border-border/40">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Settings2 className="h-5 w-5" />
              <span className="font-medium">
                الاسم بالإنجليزية (System Name):
              </span>
              <span className="font-bold text-foreground">
                {role.definition.nameEn}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
