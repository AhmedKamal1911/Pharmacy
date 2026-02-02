import { createRootRoute, Outlet } from "@tanstack/react-router";
import {
  sidebarConfig,
  type SidebarGroup as SidebarGroupConfig,
} from "@/config/sidebar-config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/Logo";
import { Header } from "@/components/shared/Header";
import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <SidebarProvider dir="rtl">
      <Sidebar dir="rtl" side="right" variant="inset" collapsible="offcanvas">
        <SidebarHeader className="border-b border-gray-200 bg-white">
          <div className="px-4 py-3">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-gray-50">
          {sidebarConfig.map((group: SidebarGroupConfig) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-gray-500">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item: { title: string; href: string }) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.href}
                          className="w-full justify-start px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
                          activeProps={{
                            className:
                              "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600",
                          }}
                        >
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="border-t border-gray-200 bg-white">
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500 text-center">
              الصيدلية الفائقة v1.0
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-gray-50">
        <Header />

        <main className="flex-1 p-6">
          <div className="mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
