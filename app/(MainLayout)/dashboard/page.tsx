"use client";
import { BotStatus } from "@/components/bot-status";
import { ChartOverview } from "@/components/chart-overview";
import { RecentActivity } from "@/components/recent-activity";
import { StatsCard } from "@/components/stats-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiClient } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { FileVideo, HardDrive, MessageSquare, Users } from "lucide-react";
import React from "react";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/api/dashboard/stats");
      return res.data;
    },
  });

  function formatFileSize(bytes: number) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = Number.parseInt(
      Math.floor(Math.log(bytes) / Math.log(1024)).toString()
    );
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
            Bot Online
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          description={`${stats?.userGrowth}% from last month`}
          icon={Users}
          trend={
            stats?.userGrowth === 0
              ? "neutral"
              : stats?.userGrowth > 0
              ? "up"
              : "down"
          }
          isLoading={statsLoading}
        />
        <StatsCard
          title="Active Files"
          value={stats?.totalFiles || 0}
          description={`${stats?.fileGrowth}% from last month`}
          icon={FileVideo}
          trend={
            stats?.fileGrowth === 0
              ? "neutral"
              : stats?.fileGrowth > 0
              ? "up"
              : "down"
          }
          isLoading={statsLoading}
        />
        <StatsCard
          title="Pending Feedback"
          value={stats?.pendingFeedbacks || 0}
          description={`${stats?.feedbackGrowth}% from last month`}
          icon={MessageSquare}
          trend={
            stats?.feedbackGrowth === 0
              ? "neutral"
              : stats?.feedbackGrowth > 0
              ? "up"
              : "down"
          }
          isLoading={statsLoading}
        />
        <StatsCard
          title="Storage Used"
          value={formatFileSize(stats?.totalStorageUsed || 0)}
          icon={HardDrive}
          isLoading={statsLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartOverview data={stats?.graph} loading={statsLoading} />
          </CardContent>
        </Card>

        <Card className="md:col-span-3 w-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest bot interactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      <div>
        <BotStatus />
      </div>
    </div>
  );
};

export default Dashboard;
