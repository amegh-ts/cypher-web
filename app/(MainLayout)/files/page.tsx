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
  Filter,
  Download,
  FileVideo,
  ExternalLink,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteFiles } from "@/hooks/files/useInfiniteFiles";
import { useFileStats } from "@/hooks/files/useFileStats";
import { formatFileSize } from "@/utils/formatFileSize";
import { StatsCard } from "@/components/stats-card";
import { motion } from "framer-motion";

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteFiles(searchTerm);

  const { data: stats, isLoading: statsLoading } = useFileStats();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredFiles = data?.pages.flat() || [];

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
            <h2 className="text-3xl font-bold tracking-tight">Files</h2>
            <p className="text-muted-foreground">
              Manage movie files and media content
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
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
            title="Total Files"
            value={String(stats?.totalFiles)}
            description="Total indexed files"
            icon={FileVideo}
            isLoading={statsLoading}
          />

          <StatsCard
            title="Total Size"
            value={formatFileSize(stats?.totalSize ?? 0)}
            description="Across all files"
            icon={FileVideo}
            isLoading={statsLoading}
          />

          <StatsCard
            title="Video Files"
            value={String(stats?.videoCount)}
            description="Movie and TV content"
            icon={FileVideo}
            isLoading={statsLoading}
          />

          <StatsCard
            title="Avg File Size"
            value={formatFileSize(stats?.avgSize ?? 0)}
            description="Per file average"
            icon={FileVideo}
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
              <CardTitle>File Management</CardTitle>
              <CardDescription>
                View and manage all uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
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
                      <TableHead>File Name</TableHead>
                      <TableHead>File ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading
                      ? [...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-12" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-12" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-12" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-12" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-12" />
                            </TableCell>
                          </TableRow>
                        ))
                      : filteredFiles.map((file) => (
                          <TableRow key={file._id}>
                            <TableCell className="font-medium max-w-xs">
                              <div className="flex items-center space-x-2">
                                <FileVideo className="h-4 w-4 text-blue-600" />
                                <span
                                  className="truncate"
                                  title={file.file_name}
                                >
                                  {file.file_name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {file._id}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {file.file_type
                                  ? file.file_type.split("/")[1].toUpperCase()
                                  : "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatFileSize(file.file_size)}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={`https://t.me/cypher_v2_bot?start=sendfile-_-${file._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
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
                                  <DropdownMenuItem>Edit file</DropdownMenuItem>
                                  <DropdownMenuItem>Copy link</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    Delete file
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {(isLoading ? [...Array(5)] : filteredFiles).map((file, i) => (
                  <motion.div
                    key={file?._id ?? i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Card className="rounded-2xl shadow-sm border border-border bg-card">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <FileVideo className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="text-sm font-medium">
                              {file?.file_name ?? (
                                <Skeleton className="h-4 w-32" />
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <div className="truncate">
                                Type:{" "}
                                <span className="font-medium">
                                  {file?.file_type
                                    ?.split("/")[1]
                                    .toUpperCase() ?? "N/A"}
                                </span>
                              </div>
                              <div className="truncate">
                                Size:{" "}
                                <span className="font-medium">
                                  {formatFileSize(file?.file_size ?? 0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground truncate">
                          ID: {file?._id ?? <Skeleton className="h-3 w-24" />}
                        </div>

                        <div className="flex items-center justify-between">
                          <a
                            href={`https://t.me/cypher_v2_bot?start=sendfile-_-${file?._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
                          >
                            Open in Telegram
                            <ExternalLink className="h-3 w-3" />
                          </a>

                          <Badge
                            variant="outline"
                            className="text-xs rounded px-2 py-0.5"
                          >
                            {file?.file_type?.split("/")[1].toUpperCase() ??
                              "N/A"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center" ref={ref}>
                <span className="p-4 text-center text-muted-foreground">
                  {isFetchingNextPage
                    ? "Loading more..."
                    : hasNextPage
                    ? "Scroll to load more"
                    : "No more users"}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
