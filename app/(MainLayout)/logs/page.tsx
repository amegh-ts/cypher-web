"use client";
import { ApiFilter } from "@/components/Filter";
import { StatsCard } from "@/components/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/utils/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Clock, Download, FileText, Search } from "lucide-react";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["cypher-logs", searchTerm, type],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await apiClient.get(
          `/api/logs?skip=${pageParam}&limit=20&search=${searchTerm}&type=${type}`
        );

        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length < 20 ? undefined : allPages.length * 20;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["logs-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/api/logs/stats");
      return res.data;
    },
  });

  const filteredLogs = data?.pages.flat() || [];

  return (
    <div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Logs</h2>
            <p className="text-muted-foreground">Manage bot logs</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Logs"
            value={stats?.total || 0}
            icon={FileText}
            isLoading={statsLoading}
          />

          <StatsCard
            title="Today's Logs"
            value={stats?.today || 0}
            icon={Clock}
            isLoading={statsLoading}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Log Management</CardTitle>
            <CardDescription>View and manage all bot logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ApiFilter
                selected={type.split(",")}
                onChange={(types) => setType(types.join(","))}
                logTypes={[
                  "USER_ACTION",
                  "GROUP_ACTION",
                  "BOT_ACTION",
                  "ADMIN_ACTION",
                ]}
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>User Id</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Meta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-4 w-[100px]" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>

                          <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                        </TableRow>
                      ))
                    : filteredLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>{log.type}</TableCell>
                          <TableCell>{log.user_id}</TableCell>
                          <TableCell>
                            {DateTime.fromISO(log.timestamp)
                              .setZone("local")
                              .toLocaleString(DateTime.DATETIME_MED)}
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge>View</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <pre className="whitespace-pre-wrap text-xs">
                                  {JSON.stringify(log.meta, null, 2)}
                                </pre>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  <TableRow ref={ref}>
                    <TableCell
                      colSpan={6}
                      className="p-4 text-center text-muted-foreground"
                    >
                      {isFetchingNextPage
                        ? "Loading more..."
                        : hasNextPage
                        ? "Scroll to load more"
                        : "No more users"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;
