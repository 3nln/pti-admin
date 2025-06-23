import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Truck,
  ClipboardCheck,
  BarChart3,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationSystem from "@/components/shared/NotificationSystem";

interface AppLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users,
  },
  {
    title: "Vehicles",
    url: "/vehicles",
    icon: Truck,
  },
  {
    title: "PTI Sessions",
    url: "/pti-sessions",
    icon: ClipboardCheck,
  },
  {
    title: "Statistics",
    url: "/statistics",
    icon: BarChart3,
  },
];

const AppSidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("pti_auth");
    localStorage.removeItem("pti_role");
    window.location.href = "/login";
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div className="font-bold text-lg">PTI Easy</div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b bg-background px-6 py-3">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <NotificationSystem />
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-pti-gray-900">
                      Fleet Manager
                    </div>
                    <div className="text-xs text-pti-gray-500">
                      dispatcher@company.com
                    </div>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-pti-blue text-white text-sm">
                      FM
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
