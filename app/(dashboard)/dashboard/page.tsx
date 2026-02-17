"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/_ui/Card";
import { Users, FileText, Activity, Server, Loader2 } from "lucide-react";

async function fetchStats() {
    const res = await fetch("/api/dashboard/stats");
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
}

export default function DashboardPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboardStats"],
        queryFn: fetchStats,
        refetchInterval: 30000, // Refresh every 30s
    });

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-destructive">
                Error loading dashboard stats. Please try again.
            </div>
        );
    }

    const { overview, filesByType, recentFiles } = data;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Telegram Bot Users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.totalFiles}</div>
                        <p className="text-xs text-muted-foreground">Indexed Files</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.totalGroups}</div>
                        <p className="text-xs text-muted-foreground">Connected Chats</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Online</div>
                        <p className="text-xs text-muted-foreground">
                            All systems operational
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>File Distribution</CardTitle>
                        <CardDescription>Breakdown by file type.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filesByType.map((type: any) => (
                                <div key={type._id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {type._id}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {type.count} files
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {(type.totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Uploads</CardTitle>
                        <CardDescription>Latest files added to the index.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentFiles.map((file: any) => (
                                <div key={file._id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none truncate max-w-[200px]">
                                            {file.file_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {file.quality} • {file.language}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
