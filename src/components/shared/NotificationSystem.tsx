import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: "pti_completed" | "pti_overdue" | "issue_reported" | "driver_assigned";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
  data?: {
    vehicleId?: string;
    driverId?: string;
    ptiId?: string;
    issueCount?: number;
  };
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "issue_reported",
    title: "Issues Found in PTI",
    message: "Van #205 has 2 issues reported by Sarah Smith",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: "high",
    data: {
      vehicleId: "Van #205",
      driverId: "Sarah Smith",
      issueCount: 2,
    },
  },
  {
    id: "2",
    type: "pti_completed",
    title: "PTI Completed",
    message: "Truck #101 inspection completed successfully by John Doe",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: "medium",
    data: {
      vehicleId: "Truck #101",
      driverId: "John Doe",
    },
  },
  {
    id: "3",
    type: "pti_overdue",
    title: "PTI Overdue",
    message: "Truck #107 PTI is overdue by 2 hours",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    priority: "high",
    data: {
      vehicleId: "Truck #107",
    },
  },
  {
    id: "4",
    type: "driver_assigned",
    title: "Driver Assigned",
    message: "David Wilson assigned to Van #201",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
    priority: "low",
    data: {
      vehicleId: "Van #201",
      driverId: "David Wilson",
    },
  },
];

const NotificationSystem = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (simulation)
      if (Math.random() > 0.95) {
        const newNotification: Notification = {
          id: `${Date.now()}`,
          type: "pti_completed",
          title: "New PTI Completed",
          message: `Truck #${Math.floor(Math.random() * 200) + 100} inspection just completed`,
          timestamp: new Date(),
          read: false,
          priority: "medium",
        };

        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);

        // Show toast notification
        toast.success(newNotification.title, {
          description: newNotification.message,
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "pti_completed":
        return <CheckCircle className="h-4 w-4 text-pti-green" />;
      case "issue_reported":
        return <AlertTriangle className="h-4 w-4 text-pti-red" />;
      case "pti_overdue":
        return <Clock className="h-4 w-4 text-pti-orange" />;
      case "driver_assigned":
        return <CheckCircle className="h-4 w-4 text-pti-blue" />;
      default:
        return <Bell className="h-4 w-4 text-pti-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-pti-red bg-pti-red-50";
      case "medium":
        return "border-l-pti-orange bg-pti-orange-50";
      case "low":
        return "border-l-pti-blue bg-pti-blue-50";
      default:
        return "border-l-pti-gray bg-pti-gray-50";
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // Navigate to relevant page based on notification type
    switch (notification.type) {
      case "pti_completed":
      case "pti_overdue":
        toast.info("Navigating to PTI Sessions...");
        // window.location.href = "/pti-sessions";
        break;
      case "issue_reported":
        toast.info("Navigating to PTI Details...");
        break;
      case "driver_assigned":
        toast.info("Navigating to Employees...");
        // window.location.href = "/employees";
        break;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-pti-blue-50"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-pti-red"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-pti-gray-900">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-pti-blue hover:text-pti-blue-600"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-pti-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-3 border-l-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      !notification.read
                        ? getPriorityColor(notification.priority)
                        : "border-l-gray-200 bg-white"
                    } ${!notification.read ? "opacity-100" : "opacity-70"}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${
                              !notification.read
                                ? "text-pti-gray-900"
                                : "text-pti-gray-600"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-pti-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-pti-gray-500">
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                            })}
                          </span>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-pti-blue rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className="w-full text-pti-blue hover:text-pti-blue-600 hover:bg-pti-blue-50"
              onClick={() => {
                setIsOpen(false);
                toast.info("View all notifications feature coming soon!");
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationSystem;
