/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  X,
  Search,
  Users,
  Activity,
  AlertCircle,
  User,
  Settings,
  Database,
  Shield,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LogEntry {
  _id: string;
  type: string;
  user_id?: number;
  meta: Record<string, any>;
  timestamp: string; // Changed from { $date: string } to string
  date: string;
  time: string;
}

interface Notification {
  id: string;
  data: LogEntry;
  read: boolean;
}

const getNotificationIcon = (type: string, meta: Record<string, any>) => {
  switch (type) {
    case "USER_ACTION":
      if (meta.action === "search") return Search;
      return User;
    case "GROUP_ACTION":
      return Users;
    case "SYSTEM_ACTION":
      return Settings;
    case "DATABASE_ACTION":
      return Database;
    case "SECURITY_ACTION":
      return Shield;
    case "ERROR":
      return AlertCircle;
    case "PERFORMANCE":
      return Zap;
    default:
      return Activity;
  }
};

const getNotificationStyle = (type: string) => {
  switch (type) {
    case "USER_ACTION":
      return {
        iconBg: "bg-blue-100 dark:bg-blue-950/50",
        iconColor: "text-blue-600 dark:text-blue-400",
        badge:
          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
      };
    case "GROUP_ACTION":
      return {
        iconBg: "bg-green-100 dark:bg-green-950/50",
        iconColor: "text-green-600 dark:text-green-400",
        badge:
          "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
      };
    case "SYSTEM_ACTION":
      return {
        iconBg: "bg-purple-100 dark:bg-purple-950/50",
        iconColor: "text-purple-600 dark:text-purple-400",
        badge:
          "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800",
      };
    case "DATABASE_ACTION":
      return {
        iconBg: "bg-orange-100 dark:bg-orange-950/50",
        iconColor: "text-orange-600 dark:text-orange-400",
        badge:
          "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800",
      };
    case "SECURITY_ACTION":
      return {
        iconBg: "bg-red-100 dark:bg-red-950/50",
        iconColor: "text-red-600 dark:text-red-400",
        badge:
          "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
      };
    case "ERROR":
      return {
        iconBg: "bg-red-100 dark:bg-red-950/50",
        iconColor: "text-red-600 dark:text-red-400",
        badge:
          "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
      };
    case "PERFORMANCE":
      return {
        iconBg: "bg-yellow-100 dark:bg-yellow-950/50",
        iconColor: "text-yellow-600 dark:text-yellow-400",
        badge:
          "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-800",
      };
    default:
      return {
        iconBg: "bg-gray-100 dark:bg-gray-800/50",
        iconColor: "text-gray-600 dark:text-gray-400",
        badge:
          "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700",
      };
  }
};

const formatNotificationContent = (type: string, meta: Record<string, any>) => {
  switch (type) {
    case "USER_ACTION":
      if (meta.action === "search") {
        return {
          title: `Search by ${meta.user || "Unknown User"}`,
          description: `Query: "${meta.query}" • ${
            meta.found ? `${meta.results} results found` : "No results"
          }`,
          status: meta.found ? "success" : "warning",
        };
      }
      return {
        title: `User ${meta.action || "action"}`,
        description: `${meta.user || meta.name || "Unknown User"}${
          meta.username ? ` (@${meta.username})` : ""
        }`,
        status: "info",
      };

    case "GROUP_ACTION":
      if (meta.action === "invitation") {
        return {
          title: `Group invitation`,
          description: `${meta.user || "User"}${
            meta.username ? ` (@${meta.username})` : ""
          } ${meta.status || "joined"} "${meta.title || "group"}"`,
          status: meta.status?.includes("added") ? "success" : "info",
        };
      }
      return {
        title: `Group ${meta.action || "action"}`,
        description: `${meta.title || "Unknown Group"}${
          meta.user ? ` • by ${meta.user}` : ""
        }`,
        status: "info",
      };

    case "SYSTEM_ACTION":
      return {
        title: `System ${meta.action || "event"}`,
        description: meta.message || "System operation completed",
        status: "info",
      };

    case "DATABASE_ACTION":
      return {
        title: `Database ${meta.action || "operation"}`,
        description: `${meta.collection || "Collection"} • ${
          meta.operation || "Modified"
        }`,
        status: "info",
      };

    case "SECURITY_ACTION":
      return {
        title: `Security ${meta.action || "alert"}`,
        description: meta.details || "Security event detected",
        status: "warning",
      };

    case "ERROR":
      return {
        title: `Error: ${meta.type || "System Error"}`,
        description: meta.message || "An error occurred",
        status: "error",
      };

    default:
      return {
        title: type
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        description: Object.entries(meta)
          .slice(0, 2)
          .map(
            ([key, value]) =>
              `${key}: ${
                typeof value === "object" ? JSON.stringify(value) : value
              }`
          )
          .join(" • "),
        status: "info",
      };
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function NavNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // SSE hookup
  useEffect(() => {
    const es = new EventSource("/api/logs/stream");
    es.onmessage = (e) => {
      const log: LogEntry = JSON.parse(e.data);
      setNotifications((prev) =>
        [{ id: log._id, data: log, read: false }, ...prev].slice(0, 50)
      );
      setUnseenCount((c) => c + 1);
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, []);

  // When dropdown opens, mark all as read
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnseenCount(0);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnseenCount(0);
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full hover:bg-accent/80 transition-colors duration-200"
        >
          <Bell className="h-4 w-4" />
          {unseenCount > 0 && (
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[10px] font-semibold animate-pulse">
              {unseenCount > 99 ? "99+" : unseenCount}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-96 p-0 border-border/50 shadow-lg"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary/10">
              <Bell className="h-3.5 w-3.5 text-primary" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              Notifications
            </h4>
            {unseenCount > 0 && (
              <Badge
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
              >
                {unseenCount} new
              </Badge>
            )}
          </div>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="h-7 px-2 text-xs hover:bg-accent/80 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="rounded-full bg-muted/50 p-4 mb-4">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No notifications
              </p>
              <p className="text-xs text-muted-foreground text-center max-w-[250px]">
                You&apos;re all caught up! New notifications will appear here
                when they arrive.
              </p>
            </div>
          ) : (
            <div className="p-1">
              {notifications.map(({ id, data, read }, index) => {
                const Icon = getNotificationIcon(data.type, data.meta);
                const styles = getNotificationStyle(data.type);
                const content = formatNotificationContent(data.type, data.meta);
                const timeAgo = formatTimeAgo(data.timestamp);

                return (
                  <div key={id}>
                    <DropdownMenuItem
                      className={cn(
                        "flex items-start gap-3 p-3 cursor-pointer transition-all duration-200 hover:bg-accent/50",
                        !read && "bg-accent/30 border-l-2 border-l-primary/50"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-full p-2 flex-shrink-0 transition-colors",
                          styles.iconBg
                        )}
                      >
                        <Icon className={cn("h-4 w-4", styles.iconColor)} />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight text-foreground line-clamp-1">
                            {content.title}
                          </p>
                          {!read && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5 animate-pulse" />
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {content.description}
                        </p>

                        <div className="flex items-center justify-between pt-0.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] px-2 py-0.5 h-auto font-medium",
                              styles.badge
                            )}
                          >
                            {data.type.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {timeAgo}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>

                    {index < notifications.length - 1 && (
                      <Separator className="mx-3 opacity-50" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator className="opacity-50" />
            <div className="p-2 bg-muted/20">
              <Button
                variant="ghost"
                className="w-full text-xs h-8 hover:bg-accent/80 text-muted-foreground hover:text-foreground font-medium"
                onClick={() => {
                  // Handle view all notifications
                  console.log("View all notifications");
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
