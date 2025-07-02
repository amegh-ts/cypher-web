"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface BotStatus {
  status: "online" | "offline" | "checking";
  lastPing: string;
  responseTime: number;
  uptime: string;
}

export function BotStatus() {
  const [botStatus, setBotStatus] = useState<BotStatus>({
    status: "online",
    lastPing: new Date().toISOString(),
    responseTime: 123,
    uptime: "5h 20m",
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkBotStatus = async () => {
    setIsChecking(true);
    setBotStatus((prev) => ({ ...prev, status: "checking" }));

    // Simulate delay
    setTimeout(() => {
      setBotStatus({
        status: "online",
        lastPing: new Date().toISOString(),
        responseTime: Math.floor(Math.random() * 100) + 50,
        uptime: "5h 20m",
      });
      setIsChecking(false);
    }, 1000);
  };

  useEffect(() => {
    checkBotStatus();
    const interval = setInterval(checkBotStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    switch (botStatus.status) {
      case "online":
        return (
          <Badge variant="default" className="bg-green-500">
            Online
          </Badge>
        );
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
      case "checking":
        return <Badge variant="secondary">Checking...</Badge>;
    }
  };

  return (
    <Card className="col-span-4">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Bot Status & Health</CardTitle>
          <CardDescription>
            Real-time monitoring of your Telegram bot
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button
            variant="outline"
            size="sm"
            onClick={checkBotStatus}
            disabled={isChecking}
          >
            <RefreshCw
              className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Response Time</p>
              <p className="font-medium">
                {botStatus.responseTime > 0
                  ? `${botStatus.responseTime}ms`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Ping</p>
              <p className="font-medium">
                {botStatus.lastPing
                  ? new Date(botStatus.lastPing).toLocaleTimeString()
                  : "Never"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Uptime</p>
              <p className="font-medium">{botStatus.uptime || "Unknown"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Server Status</p>
              <p className="font-medium text-green-600">Healthy</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recent Health Checks</h4>
            <div className="space-y-2 text-sm">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {new Date(Date.now() - i * 60000).toLocaleTimeString()}
                  </span>
                  <Badge variant="default" className="bg-green-500">
                    {Math.floor(Math.random() * 100) + 50}ms
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
