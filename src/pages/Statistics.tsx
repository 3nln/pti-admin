import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Truck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock analytics data
const complianceData = [
  { month: "Jan", rate: 88, target: 95 },
  { month: "Feb", rate: 92, target: 95 },
  { month: "Mar", rate: 89, target: 95 },
  { month: "Apr", rate: 94, target: 95 },
  { month: "May", rate: 96, target: 95 },
  { month: "Jun", rate: 93, target: 95 },
];

const ptiTrendData = [
  { date: "Week 1", completed: 45, pending: 8, overdue: 2 },
  { date: "Week 2", completed: 52, pending: 6, overdue: 1 },
  { date: "Week 3", completed: 48, pending: 12, overdue: 3 },
  { date: "Week 4", completed: 58, pending: 4, overdue: 1 },
];

const issuesByCategory = [
  { name: "Brakes", value: 28, color: "#EF4444" },
  { name: "Tires", value: 22, color: "#F59E0B" },
  { name: "Lights", value: 18, color: "#10B981" },
  { name: "Fuel System", value: 15, color: "#2563EB" },
  { name: "Wipers", value: 10, color: "#8B5CF6" },
  { name: "Other", value: 7, color: "#6B7280" },
];

const vehiclePerformance = [
  { vehicle: "TRK-101", completionRate: 98, totalPTIs: 24, issues: 1 },
  { vehicle: "VAN-205", completionRate: 95, totalPTIs: 22, issues: 3 },
  { vehicle: "TRK-103", completionRate: 92, totalPTIs: 21, issues: 2 },
  { vehicle: "TRK-107", completionRate: 89, totalPTIs: 19, issues: 4 },
  { vehicle: "VAN-201", completionRate: 96, totalPTIs: 18, issues: 1 },
];

const driverPerformance = [
  { driver: "John Doe", completionRate: 100, avgTime: "8.5 min", issues: 0 },
  {
    driver: "Sarah Smith",
    completionRate: 95,
    avgTime: "12.2 min",
    issues: 2,
  },
  {
    driver: "Mike Johnson",
    completionRate: 98,
    avgTime: "9.8 min",
    issues: 1,
  },
  {
    driver: "Emily Davis",
    completionRate: 92,
    avgTime: "15.1 min",
    issues: 3,
  },
];

export default function Statistics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("compliance");

  const currentStats = {
    complianceRate: 94,
    totalPTIs: 187,
    completedPTIs: 176,
    pendingPTIs: 8,
    overduePTIs: 3,
    totalIssues: 23,
    averageTime: "11.2 min",
    topIssue: "Brakes",
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return "text-pti-green";
    if (rate >= 90) return "text-pti-orange";
    return "text-pti-red";
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 95) return "bg-pti-green";
    if (rate >= 90) return "bg-pti-orange";
    return "bg-pti-red";
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-pti-green" />;
    }
    return <TrendingDown className="h-4 w-4 text-pti-red" />;
  };

  const exportReport = () => {
    toast.success("Report exported successfully!");
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {entry.dataKey.includes("rate") ? "%" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-pti-gray-900">
              Statistics
            </h1>
            <p className="text-pti-gray-600 mt-1">
              Fleet performance analytics and compliance tracking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={exportReport}
              variant="outline"
              className="border-pti-blue text-pti-blue hover:bg-pti-blue hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Compliance Rate
              </CardTitle>
              <Target className="h-4 w-4 text-pti-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900 mb-1">
                {currentStats.complianceRate}%
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(94, 89)}
                <span
                  className={`text-xs ${getComplianceColor(currentStats.complianceRate)}`}
                >
                  +5% from last month
                </span>
              </div>
              <Progress
                value={currentStats.complianceRate}
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Total PTIs
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-pti-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900 mb-1">
                {currentStats.totalPTIs}
              </div>
              <div className="text-xs text-pti-gray-500">
                {currentStats.completedPTIs} completed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Issues Reported
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-pti-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900 mb-1">
                {currentStats.totalIssues}
              </div>
              <div className="text-xs text-pti-gray-500">
                Most common: {currentStats.topIssue}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pti-gray-600">
                Avg. Completion Time
              </CardTitle>
              <Clock className="h-4 w-4 text-pti-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pti-gray-900 mb-1">
                {currentStats.averageTime}
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-pti-green" />
                <span className="text-xs text-pti-green">-1.2 min faster</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Rate Trend</CardTitle>
                <CardDescription>
                  Monthly compliance rate vs. target (95%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={complianceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#2563EB"
                      strokeWidth={3}
                      name="Compliance Rate (%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#EF4444"
                      strokeDasharray="5 5"
                      name="Target (95%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>PTI Completion Trends</CardTitle>
                <CardDescription>
                  Weekly breakdown of PTI session statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ptiTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                    <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                    <Bar dataKey="overdue" fill="#EF4444" name="Overdue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Issues by Category</CardTitle>
                  <CardDescription>
                    Distribution of reported issues by component
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={issuesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {issuesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issue Severity Breakdown</CardTitle>
                  <CardDescription>
                    Critical issues requiring immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {issuesByCategory.slice(0, 4).map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: issue.color }}
                        />
                        <span className="font-medium">{issue.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-pti-gray-600">
                          {issue.value} issues
                        </span>
                        <Badge
                          variant={
                            issue.value > 20
                              ? "destructive"
                              : issue.value > 15
                                ? "default"
                                : "outline"
                          }
                          className={
                            issue.value > 20
                              ? "bg-pti-red"
                              : issue.value > 15
                                ? "bg-pti-orange text-white"
                                : ""
                          }
                        >
                          {issue.value > 20
                            ? "High"
                            : issue.value > 15
                              ? "Medium"
                              : "Low"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Performance</CardTitle>
                  <CardDescription>
                    PTI completion rates by vehicle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vehiclePerformance.map((vehicle, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4 text-pti-blue" />
                        <div>
                          <div className="font-medium">{vehicle.vehicle}</div>
                          <div className="text-sm text-pti-gray-500">
                            {vehicle.totalPTIs} PTIs •{" "}
                            {vehicle.issues > 0 ? (
                              <span className="text-pti-red">
                                {vehicle.issues} issues
                              </span>
                            ) : (
                              <span className="text-pti-green">No issues</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${getComplianceColor(vehicle.completionRate)}`}
                        >
                          {vehicle.completionRate}%
                        </div>
                        <Progress
                          value={vehicle.completionRate}
                          className="w-20 h-2 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Driver Performance</CardTitle>
                  <CardDescription>
                    Completion rates and efficiency metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {driverPerformance.map((driver, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-pti-green" />
                        <div>
                          <div className="font-medium">{driver.driver}</div>
                          <div className="text-sm text-pti-gray-500">
                            Avg: {driver.avgTime} •{" "}
                            {driver.issues > 0 ? (
                              <span className="text-pti-red">
                                {driver.issues} issues found
                              </span>
                            ) : (
                              <span className="text-pti-green">
                                No issues found
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${getComplianceColor(driver.completionRate)}`}
                        >
                          {driver.completionRate}%
                        </div>
                        <Progress
                          value={driver.completionRate}
                          className="w-20 h-2 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
