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
import { FileVideo, MessageSquare, TrendingUp, Users } from "lucide-react";
import React from "react";

const Dashboard = () => {
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
          value="2,847"
          description="+12% from last month"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Active Files"
          value="1,234"
          description="+8% from last month"
          icon={FileVideo}
          trend="up"
        />
        <StatsCard
          title="Pending Feedback"
          value="23"
          description="-5% from last month"
          icon={MessageSquare}
          trend="down"
        />
        <StatsCard
          title="Storage Used"
          value="847 GB"
          description="78% of total capacity"
          icon={TrendingUp}
          trend="neutral"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartOverview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
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
