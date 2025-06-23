import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClipboardCheck, LogOut, User, Bell } from "lucide-react";

interface DriverLayoutProps {
  children: ReactNode;
}

export default function DriverLayout({ children }: DriverLayoutProps) {
  const handleLogout = () => {
    localStorage.removeItem("pti_auth");
    localStorage.removeItem("pti_role");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-pti-gray-50">
      {/* Mobile Header */}
      <header className="bg-pti-blue text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-lg">PTI Easy</div>
              <div className="text-xs text-blue-100">Driver Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white/20 text-white text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-blue-100">Driver</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2 text-pti-blue"
          >
            <ClipboardCheck className="h-5 w-5" />
            <span className="text-xs">PTI Sessions</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2 text-pti-gray-600"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2 text-pti-gray-600"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
