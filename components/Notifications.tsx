/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, X } from "lucide-react";
import { useState, useEffect } from "react";

interface LogEntry {
  _id: string;
  type: string;
  meta: Record<string, any>;
  time: string;
}

interface Notification {
  id: string;
  data: LogEntry;
  read: boolean;
}

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

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell className="h-5 w-5" />
          {unseenCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unseenCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-96 min-h-[400px] max-h-[400px] overflow-y-auto p-0"
        align="end"
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="text-sm font-medium">Notifications</h4>
          <button
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              setNotifications([]);
              setUnseenCount(0);
            }}
            aria-label="Clear all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          <DropdownMenuGroup>
            {notifications.map(({ id, data, read }) => (
              <DropdownMenuItem
                key={id}
                className={`
                  flex flex-col gap-1 px-4 py-3 
                  ${read ? "bg-transparent" : "bg-blue-50 dark:bg-blue-900/20"}
                  hover:bg-gray-100 dark:hover:bg-gray-800
                `}
              >
                <span className="text-xs font-semibold text-gray-600">
                  {data.type.replace("_", " ")}
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {data.meta.action ?? "Action"}
                  {data.meta.query ? `: “${data.meta.query}”` : ""}
                </span>
                <span className="self-end text-[10px] text-gray-500">
                  {data.time}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
