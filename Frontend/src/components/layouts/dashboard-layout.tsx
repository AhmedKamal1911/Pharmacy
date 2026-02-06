import { Outlet } from "react-router";
import DashboardSidebar from "@/components/shared/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = () => {
  return (
    // SidebarProvider is mandatory for shadcn sidebar logic
    <SidebarProvider>
      <div className="w-full flex min-h-screen bg-gray-50 text-gray-900">
        {/* Sidebar - Positioned on the right for Arabic */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-xs gap-4">
            {/* SidebarTrigger allows users to collapse the menu */}
            <SidebarTrigger />
            <h2 className="text-xl font-semibold ">لوحة التحكم</h2>
          </header>

          <div className="flex-1 p-2.5 overflow-y-auto">
            {/* White container for the page content */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
