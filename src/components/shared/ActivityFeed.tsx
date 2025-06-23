import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  Truck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "pti_completed" | "pti_created" | "issue_reported" | "driver_assigned";
  vehicle: string;
  driver: string;
  timestamp: Date;
  status: "completed" | "pending" | "overdue";
  issues?: number;
  description?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  loading?: boolean;
}

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "pti_completed":
      return CheckCircle;
    case "pti_created":
      return ClipboardCheck;
    case "issue_reported":
      return AlertTriangle;
    case "driver_assigned":
      return User;
    default:
      return ClipboardCheck;
  }
};

const getActivityColor = (type: ActivityItem["type"]) => {
  switch (type) {
    case "pti_completed":
      return "text-pti-green bg-pti-green-50";
    case "pti_created":
      return "text-pti-blue bg-pti-blue-50";
    case "issue_reported":
      return "text-pti-red bg-pti-red-50";
    case "driver_assigned":
      return "text-pti-orange bg-pti-orange-50";
    default:
      return "text-pti-gray bg-pti-gray-50";
  }
};

const getStatusBadge = (status: ActivityItem["status"], issues = 0) => {
  if (status === "overdue") {
    return (
      <Badge variant="destructive" className="bg-pti-red">
        Overdue
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge variant="outline" className="text-pti-orange border-pti-orange">
        Pending
      </Badge>
    );
  }
  if (issues > 0) {
    return (
      <Badge variant="destructive" className="bg-pti-red">
        {issues} Issue{issues > 1 ? "s" : ""}
      </Badge>
    );
  }
  return <Badge className="bg-pti-green">Completed</Badge>;
};

const ActivityFeedSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
    ))}
  </div>
);

export default function ActivityFeed({
  activities,
  loading = false,
}: ActivityFeedProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeedSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-pti-blue" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-6 space-y-1">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const colorClasses = getActivityColor(activity.type);

              return (
                <div key={activity.id}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className={`p-2 rounded-lg ${colorClasses}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-pti-gray-900 group-hover:text-pti-blue transition-colors">
                            {activity.vehicle}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-pti-gray-600">
                            <User className="h-3 w-3" />
                            <span>{activity.driver}</span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(activity.timestamp, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          {activity.description && (
                            <p className="text-xs text-pti-gray-500 mt-1">
                              {activity.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(activity.status, activity.issues)}
                          {activity.issues && activity.issues > 0 && (
                            <div className="flex items-center gap-1 text-xs text-pti-red">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Attention needed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < activities.length - 1 && (
                    <Separator className="ml-11" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
