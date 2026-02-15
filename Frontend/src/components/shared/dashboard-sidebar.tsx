import {
  Pill,
  TrendingUp,
  PackageSearch,
  Users,
  Settings,
  LogOut,
  ShoppingCart,
  Truck,
  LayoutDashboard,
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
import { NavLink, useLocation } from "react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"; // وظيفة shadcn لدمج الكلاسات

const NAV_ITEMS = [
  {
    group: "القائمة الرئيسية",
    items: [
      { title: "لوحة التحكم", url: "/", icon: LayoutDashboard },
      { title: "المبيعات", url: "/sales", icon: TrendingUp },
      { title: "المخزون", url: "/inventory", icon: PackageSearch },
    ],
  },
  {
    group: "الإدارة والنظام",
    items: [
      { title: "العملاء", url: "/customers", icon: Users },
      { title: "الموردين", url: "/suppliers", icon: Truck },
      { title: "المشتريات", url: "/purchases", icon: ShoppingCart },
      { title: "التقارير", url: "/reports", icon: TrendingUp },
      { title: "الإعدادات", url: "/settings", icon: Settings },
    ],
  },
];

export default function DashboardSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className="border-l border-slate-200/60 bg-white/90 backdrop-blur-xl transition-all duration-300"
    >
      {/* Header Section */}
      <SidebarHeader className="p-5">
        <div
          className={cn(
            "flex items-center gap-3 transition-all duration-300",
            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0",
          )}
        >
          {/* اللوجو: مربع بإنحناء خفيف وألوان هادية */}
          <div className="flex items-center justify-center w-10 h-10 shrink-0 bg-primary/10 rounded-xl border border-primary/20 transition-transform duration-300">
            <Pill size={22} className="text-primary" />
          </div>

          {/* النصوص: رصانة وبساطة */}
          <div
            className={cn(
              "flex flex-col truncate transition-all duration-300",
              "group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0",
            )}
          >
            <span className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">
              صيدليتي
            </span>
            <span className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
              إدارة الصيدلية
            </span>
          </div>
        </div>

        {/* خط فاصل رفيع وشيك */}
        <div className="mt-5 h-[1px] w-full bg-gradient-to-l from-transparent via-slate-200 to-transparent group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full px-2 group-data-[collapsible=icon]:px-0">
          {NAV_ITEMS.map((group) => (
            <SidebarGroup key={group.group} className="mb-4">
              <SidebarGroupLabel className="px-4 text-md font-black text-slate-400 group-data-[collapsible=icon]:hidden">
                {group.group}
              </SidebarGroupLabel>
              <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
                {group.items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className="h-12 w-full"
                      >
                        <NavLink
                          to={item.url}
                          end
                          className={cn(
                            // التعديل هنا: الـ px والـ gap بيتغيروا لما الـ sidebar يقفل
                            "flex items-center rounded-lg border-2 transition-all duration-300 relative group/link",
                            "px-4 gap-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10",
                            isActive
                              ? "bg-primary/5 border-primary/40 text-primary shadow-sm"
                              : "bg-transparent border-slate-300 text-slate-500 hover:bg-slate-50 hover:text-primary hover:border-slate-300",
                          )}
                        >
                          <item.icon
                            size={20}
                            className={cn(
                              "shrink-0 transition-colors duration-300",
                              isActive
                                ? "text-primary"
                                : "text-slate-400 group-hover/link:text-primary",
                            )}
                          />
                          <span className="font-bold group-data-[collapsible=icon]:hidden whitespace-nowrap">
                            {item.title}
                          </span>

                          {/* مؤشر Active الجانبي - مخفي في حالة الـ Icon */}
                          {isActive && (
                            <div className="absolute -right-0.5 w-1 h-5 bg-primary rounded-l-full group-data-[collapsible=icon]:hidden" />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-slate-100">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton className="h-10 w-full group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center rounded-xl text-rose-500 hover:bg-rose-50">
              <LogOut size={20} className="rotate-180 shrink-0" />
              <span className="font-bold group-data-[collapsible=icon]:hidden">
                خروج
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
