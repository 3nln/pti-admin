import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Truck,
  ClipboardCheck,
  Plus,
  ArrowRight,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

const quickActions: QuickAction[] = [
  {
    id: "create-employee",
    title: "Create Employee",
    description: "Add a new driver or dispatcher to your fleet",
    icon: Users,
    color: "text-pti-blue",
    bgColor: "bg-pti-blue-50",
    href: "/employees",
    badge: "Quick",
    badgeVariant: "outline",
  },
  {
    id: "add-vehicle",
    title: "Add Vehicle",
    description: "Register a new vehicle in your fleet",
    icon: Truck,
    color: "text-pti-green",
    bgColor: "bg-pti-green-50",
    href: "/vehicles",
    badge: "Popular",
    badgeVariant: "secondary",
  },
  {
    id: "create-pti",
    title: "Create PTI Session",
    description: "Assign a new pre-trip inspection to a driver",
    icon: ClipboardCheck,
    color: "text-pti-orange",
    bgColor: "bg-pti-orange-50",
    href: "/pti-sessions",
    badge: "Urgent",
    badgeVariant: "destructive",
  },
  {
    id: "bulk-assign",
    title: "Bulk Assign PTIs",
    description: "Create multiple PTI sessions at once",
    icon: Zap,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    onClick: () => toast.info("Bulk assignment feature coming soon!"),
    badge: "Pro",
    badgeVariant: "default",
  },
];

interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className }: QuickActionsProps) {
  const handleActionClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      window.location.href = action.href;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-pti-orange" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="w-full justify-start h-auto p-4 hover:bg-gray-50 hover:border-gray-300 group transition-all duration-200"
            onClick={() => handleActionClick(action)}
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}
              >
                <action.icon className={`h-4 w-4 ${action.color}`} />
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-pti-gray-900">
                    {action.title}
                  </span>
                  {action.badge && (
                    <Badge
                      variant={action.badgeVariant}
                      className="text-xs px-2 py-0"
                    >
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-pti-gray-600 mt-1">
                  {action.description}
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-pti-gray-400 group-hover:text-pti-gray-600 group-hover:translate-x-1 transition-all" />
          </Button>
        ))}

        <div className="pt-3 mt-6 border-t">
          <div className="text-center">
            <p className="text-xs text-pti-gray-500 mb-2">
              Need help getting started?
            </p>
            <Button
              variant="link"
              size="sm"
              className="text-pti-blue hover:text-pti-blue-600"
              onClick={() => toast.info("Help documentation coming soon!")}
            >
              View Documentation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
