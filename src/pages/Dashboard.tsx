import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StatsCard from "@/components/shared/StatsCard";
import ActivityFeed from "@/components/shared/ActivityFeed";
import QuickActions from "@/components/shared/QuickActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Truck,
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  RefreshCw,
  Calendar,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const summaryStats = [
  {
    title: "Total Drivers",
    value: "24",
    icon: Users,
    color: "text-pti-blue",
    bgColor: "bg-pti-blue-50",
    change: "+2 this month",
    changeType: "positive" as const,
  },
  {
    title: "Active Vehicles",
    value: "18",
    icon: Truck,
    color: "text-pti-green",
    bgColor: "bg-pti-green-50",
    change: "+1 this week",
    changeType: "positive" as const,
  },
  {
    title: "Pending PTIs",
    value: "7",
    icon: Clock,
    color: "text-pti-orange",
    bgColor: "bg-pti-orange-50",
    change: "Due today",
    changeType: "neutral" as const,
  },
  {
    title: "Completed PTIs",
    value: "156",
    icon: CheckCircle,
    color: "text-pti-green",
    bgColor: "bg-pti-green-50",
    change: "+12 today",
    changeType: "positive" as const,
  },
];

const recentActivities = [
  {
    id: "1",
    type: "pti_completed" as const,
    vehicle: "Truck #101",
    driver: "John Doe",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    status: "completed" as const,
    issues: 0,
    description: "All systems checked and operational",
  },
  {
    id: "2",
    type: "issue_reported" as const,
    vehicle: "Van #205",
    driver: "Sarah Smith",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: "completed" as const,
    issues: 2,
    description: "Brake pads need replacement, windshield wipers worn",
  },
  {
    id: "3",
    type: "pti_completed" as const,
    vehicle: "Truck #103",
    driver: "Mike Johnson",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: "completed" as const,
    issues: 0,
    description: "Pre-trip inspection completed successfully",
  },
  {
    id: "4",
    type: "pti_created" as const,
    vehicle: "Truck #107",
    driver: "Emily Davis",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "pending" as const,
    issues: 0,
    description: "New PTI session assigned for morning shift",
  },
  {
    id: "5",
    type: "driver_assigned" as const,
    vehicle: "Van #201",
    driver: "David Wilson",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "completed" as const,
    issues: 1,
    description: "Driver assigned to new vehicle, minor tire pressure issue",
  },
];

const complianceData = {
  thisMonth: 94,
  lastMonth: 91,
  target: 95,
  trend: "up",
};

const issueBreakdown = [
  { category: "Brakes", count: 12, severity: "high" },
  { category: "Tires", count: 8, severity: "medium" },
  { category: "Lights", count: 5, severity: "low" },
  { category: "Fuel", count: 3, severity: "low" },
  { category: "Wipers", count: 2, severity: "low" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Dashboard refreshed successfully!");
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-pti-red bg-pti-red-50 border-pti-red";
      case "medium":
        return "text-pti-orange bg-pti-orange-50 border-pti-orange";
      default:
        return "text-pti-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-pti-gray-900">
              Dashboard
            </h1>
            <p className="text-pti-gray-600 mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Welcome back! Here's your fleet overview for today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => toast.info("Export feature coming soon!")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-pti-blue hover:bg-pti-blue-600"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
              change={stat.change}
              changeType={stat.changeType}
              loading={loading}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Activity Feed - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ActivityFeed activities={recentActivities} loading={loading} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <QuickActions />

            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pti-green" />
                  Compliance Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-pti-gray-900">
                    {complianceData.thisMonth}%
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-pti-gray-600">
                      Target: {complianceData.target}%
                    </div>
                    <div
                      className={`text-xs ${
                        complianceData.thisMonth >= complianceData.target
                          ? "text-pti-green"
                          : "text-pti-orange"
                      }`}
                    >
                      {complianceData.thisMonth >= complianceData.target
                        ? "Above target"
                        : "Below target"}
                    </div>
                  </div>
                </div>
                <Progress value={complianceData.thisMonth} className="w-full" />
                <div className="text-xs text-pti-gray-500">
                  {complianceData.thisMonth > complianceData.lastMonth
                    ? `+${complianceData.thisMonth - complianceData.lastMonth}%`
                    : `${
                        complianceData.thisMonth - complianceData.lastMonth
                      }%`}{" "}
                  from last month
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Issues Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-pti-orange" />
              Recent Issues Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              {issueBreakdown.map((issue) => (
                <div
                  key={issue.category}
                  className={`p-4 rounded-lg border-2 border-dashed transition-colors hover:bg-opacity-50 ${getSeverityColor(
                    issue.severity,
                  )}`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{issue.count}</div>
                    <div className="text-sm font-medium">{issue.category}</div>
                    <div className="text-xs opacity-70 capitalize mt-1">
                      {issue.severity} priority
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
