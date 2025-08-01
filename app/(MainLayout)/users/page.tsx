"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Filter,
  Download,
} from "lucide-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/utils/axios";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/stats-card";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["cypher-users", searchTerm],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await apiClient.get(
          `/api/users?skip=${pageParam}&limit=20&search=${searchTerm}`
        );

        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length < 20 ? undefined : allPages.length * 20;
      },
    });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/api/users/stats");
      return res.data;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredUsers = data?.pages.flat() || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">
              Manage bot users and permissions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-4 grid-cols-2 lg:grid-cols-4"
        >
          <StatsCard
            title="Total Users"
            icon={UserPlus}
            value={stats?.total}
            description="Total bot users"
            isLoading={statsLoading}
          />
          <StatsCard
            title="Active Users"
            icon={UserPlus}
            value={stats?.active}
            description="Users allowed in bot"
            isLoading={statsLoading}
          />
          <StatsCard
            title="New Today"
            icon={UserPlus}
            value={stats?.newToday}
            description="Users signed up today"
            isLoading={statsLoading}
          />
          <StatsCard
            title="Blocked Users"
            icon={UserPlus}
            value={stats?.blocked}
            description="Users blocked in bot"
            isLoading={statsLoading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all bot users</CardDescription>
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
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>DC ID</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading
                      ? [...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                            {Array(6)
                              .fill(0)
                              .map((_, j) => (
                                <TableCell key={j}>
                                  <Skeleton className="h-4 w-[100px]" />
                                </TableCell>
                              ))}
                          </TableRow>
                        ))
                      : filteredUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="/placeholder-user.jpg" />
                                  <AvatarFallback>{user.name}</AvatarFallback>
                                </Avatar>
                                <span>{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {user._id}
                            </TableCell>
                            <TableCell>{user.dc_id || "N/A"}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{user.date}</div>
                                <div className="text-muted-foreground">
                                  {user.time}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.permission ? "default" : "secondary"
                                }
                              >
                                {user.permission ? "Active" : "Blocked"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Edit user</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    {user.permission
                                      ? "Block user"
                                      : "Unblock user"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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

              {/* Mobile Card List */}
              <div className="md:hidden space-y-4">
                {(isLoading ? [...Array(3)] : filteredUsers).map((user, i) => (
                  <Card
                    key={user?._id ?? i}
                    className="rounded-2xl shadow-sm border"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {user?.name?.[0] ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-semibold truncate max-w-[180px]">
                            {user?.name ?? <Skeleton className="h-4 w-24" />}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            User ID:{" "}
                            {user?._id ?? <Skeleton className="h-3 w-20" />}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-2 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span className="truncate max-w-[60%]">DC ID:</span>
                        <span className="truncate text-right">
                          {user?.dc_id ?? "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="truncate max-w-[60%]">Joined:</span>
                        <span className="truncate text-right">
                          {user?.date ?? "N/A"}
                          {user?.time && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({user.time})
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="truncate max-w-[60%]">Status:</span>
                        <Badge
                          variant={user?.permission ? "default" : "secondary"}
                        >
                          {user?.permission ? "Active" : "Blocked"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-center" ref={ref}>
                  <span className="p-4 text-center text-muted-foreground">
                    {isFetchingNextPage
                      ? "Loading more..."
                      : hasNextPage
                      ? "Scroll to load more"
                      : "No more users"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
