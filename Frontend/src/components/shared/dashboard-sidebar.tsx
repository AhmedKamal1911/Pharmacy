import {
  Pill,
  LayoutDashboard,
  PackageSearch,
  Users,
  Settings,
  LogOut,
  ShoppingCart,
  Truck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";

const NAV_ITEMS = [
  {
    group: "العامة",
    items: [
      { title: "الرئيسية", url: "/", icon: LayoutDashboard },
      { title: "المخزون", url: "/inventory", icon: PackageSearch },
    ],
  },
  {
    group: "الإدارة",
    items: [
      { title: "العملاء", url: "/customers", icon: Users },
      { title: "الموردين", url: "/suppliers", icon: Truck },
      { title: "المشتريات", url: "/purchases", icon: ShoppingCart },
      { title: "الإعدادات", url: "/settings", icon: Settings },
    ],
  },
];

export default function DashboardSidebar() {
  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="py-5">
        <div className="flex justify-center gap-3">
          <Pill size={24} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {NAV_ITEMS.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground">
              {group.group}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-primary/10 text-primary font-bold" : ""
                      }
                    >
                      <item.icon size={20} />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut size={20} />
              <span className="group-data-[collapsible=icon]:hidden">
                تسجيل الخروج
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
