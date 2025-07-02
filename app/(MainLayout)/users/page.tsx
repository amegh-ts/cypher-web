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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["users", searchTerm],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await fetch(
          `/api/users?skip=${pageParam}&limit=20&search=${searchTerm}`
        );
        const data = await res.json();
        return data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length < 20 ? undefined : allPages.length * 20;
      },
    });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const res = await fetch("/api/user-stats");
      return res.json();
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredUsers = data?.pages.flat() || [];

  return (
    <div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
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
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.total ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Total bot users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.active ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Users allowed in bot
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.newToday ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Users signed up today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Blocked Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.blocked ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Users blocked in bot
              </p>
            </CardContent>
          </Card>
        </div>

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

            <div className="rounded-md border">
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
                          <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                        </TableRow>
                      ))
                    : filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>
                                  {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
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
                                <Button variant="ghost" className="h-8 w-8 p-0">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
