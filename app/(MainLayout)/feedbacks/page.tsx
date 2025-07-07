"use client";

import { ApiFilter } from "@/components/Filter";
import { StatsCard } from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/utils/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Download,
  MessageSquare,
  Search,
} from "lucide-react";
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
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const Feedbacks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["cypher-feedbacks", searchTerm, type],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await apiClient.get(
          `/api/feedbacks?skip=${pageParam}&limit=20&search=${searchTerm}&type=${type}`
        );

        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length < 20 ? undefined : allPages.length * 20;
      },
    });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["feedback-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/api/feedbacks/stats");
      return res.data;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredFeedbacks = data?.pages.flat() || [];
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Feedbacks</h2>
          <p className="text-muted-foreground">Manage bot feedbacks here</p>
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
          title="Total Feedbacks"
          value={stats?.total || 0}
          icon={MessageSquare}
          isLoading={statsLoading}
        />
        <StatsCard
          title="Today"
          value={stats?.today || 0}
          icon={CalendarDays}
          isLoading={statsLoading}
        />
        <StatsCard
          title="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle}
          isLoading={statsLoading}
        />
        <StatsCard
          title="Pending"
          value={stats?.pending || 0}
          icon={Clock}
          isLoading={statsLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Management</CardTitle>
          <CardDescription>
            View and manage all bot feedbacks and reports
          </CardDescription>
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
              logTypes={["Resolved", "Pending"]}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ticket ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[180px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                      </TableRow>
                    ))
                  : filteredFeedbacks.map((fb) => (
                      <TableRow key={fb._id}>
                        <TableCell className="capitalize">{fb.type}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{fb.username}</span>
                            <span className="text-muted-foreground text-xs">
                              {fb.user_id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {fb.date} – {fb.time}
                        </TableCell>
                        <TableCell className="max-w-[240px] truncate">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-pointer text-sm text-muted-foreground">
                                {fb.feedback}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs whitespace-pre-wrap text-xs">
                              {fb.feedback}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              fb.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {fb.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{fb.ticket_id}</Badge>
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
  );
};

export default Feedbacks;
