"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  RefreshCw,
  Server,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BotStatusProps {
  isLoading?: boolean;
}

export function BotStatus({ isLoading }: BotStatusProps) {
  const statusData = {
    uptime: "2 days, 14 hours, 32 minutes",
    cpuUsage: "15%",
    memoryUsage: "6.2 GB / 16 GB",
    diskUsage: "120 GB / 500 GB",
    networkTraffic: "50 MB/s In, 20 MB/s Out",
    lastRestart: "2025-07-29 10:00 AM",
    status: "online", // "online" or "offline"
    activeConnections: 125,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-2">
              {statusData.status === "online" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <p className="text-sm">
                Status:{" "}
                <span
                  className={cn(
                    "font-medium",
                    statusData.status === "online"
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {statusData.status.charAt(0).toUpperCase() +
                    statusData.status.slice(1)}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">Uptime: {statusData.uptime}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">CPU Usage: {statusData.cpuUsage}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">Memory Usage: {statusData.memoryUsage}</p>
            </div>
            <div className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">Disk Usage: {statusData.diskUsage}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Network className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">Network: {statusData.networkTraffic}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">
                Active Connections: {statusData.activeConnections}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">Last Restart: {statusData.lastRestart}</p>
            </div>
          </div>
        )}
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground">
          This data is updated every 30 seconds.
        </p>
      </CardContent>
    </Card>
  );
}
