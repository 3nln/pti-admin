import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  change,
  changeType = "neutral",
  loading = false,
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-pti-green";
      case "negative":
        return "text-pti-red";
      default:
        return "text-pti-gray-500";
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-pti-gray-600 group-hover:text-pti-gray-800 transition-colors">
          {title}
        </CardTitle>
        <div
          className={cn(
            "p-2 rounded-lg transition-colors",
            bgColor,
            "group-hover:scale-110 transition-transform",
          )}
        >
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-pti-gray-900 mb-1">{value}</div>
        {change && <p className={cn("text-xs", getChangeColor())}>{change}</p>}
      </CardContent>
    </Card>
  );
}
