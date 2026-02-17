"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/_ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/_ui/Button";
import { Bell, AlertTriangle, Info, CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const notifications = [
    {
        id: "1",
        title: "System Update Scheduled",
        message: "The system will undergo maintenance on Feb 20 at 02:00 AM UTC.",
        type: "info",
        timestamp: "2 hours ago",
        read: false,
    },
    {
        id: "2",
        title: "High Error Rate Detected",
        message: "Spike in 500 errors detected in the File Scraper module.",
        type: "alert",
        timestamp: "5 hours ago",
        read: false,
    },
    {
        id: "3",
        title: "Database Backup Completed",
        message: "Daily backup was successful. Size: 4.2GB",
        type: "success",
        timestamp: "1 day ago",
        read: true,
    },
];

const icons = {
    info: Info,
    alert: AlertTriangle,
    success: CheckCircle2,
    system: Bell,
};

const colors = {
    info: "text-blue-500 bg-blue-500/10",
    alert: "text-red-500 bg-red-500/10",
    success: "text-green-500 bg-green-500/10",
    system: "text-primary bg-primary/10",
};

export function NotificationList() {
    return (
        <div className="space-y-4">
            {notifications.map((notif, index) => {
                const Icon = icons[notif.type as keyof typeof icons] || Bell;
                const color = colors[notif.type as keyof typeof colors] || colors.system;

                return (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={!notif.read ? "border-l-4 border-l-primary" : ""}>
                            <div className="flex items-start p-4 gap-4">
                                <div className={`p-2 rounded-full ${color} shrink-0`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium leading-none">{notif.title}</p>
                                        <span className="text-xs text-muted-foreground">{notif.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
