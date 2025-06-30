"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  FileVideo,
  MessageSquare,
  Settings,
  BarChart3,
  Menu,
  X,
  Bot,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "Files",
    href: "/files",
    icon: FileVideo,
  },
  {
    name: "Feedback",
    href: "/feedback",
    icon: MessageSquare,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className="fixed inset-0 z-50 lg:hidden" aria-hidden="true">
        {/* <div className="fixed inset-0 bg-gray-600/75" /> */}
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r transition-all duration-300 lg:static lg:inset-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div
            className={cn(
              "flex items-center space-x-2",
              collapsed && "justify-center"
            )}
          >
            <Bot className="h-8 w-8 text-primary" />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold">CYPHER</h1>
                <p className="text-xs text-muted-foreground">Bot Admin</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            {collapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">{item.name}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Sidebar footer */}
        <div className="border-t p-4">
          <div
            className={cn(
              "flex items-center space-x-2",
              collapsed && "justify-center"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">A</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@cypher.bot
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
