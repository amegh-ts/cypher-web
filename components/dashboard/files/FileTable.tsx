"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/_ui/Button";
import { MoreHorizontal, FileIcon, Download, Trash2, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/_ui/Card";

// Mock data based on Files schema
// _id, file_name, file_link, file_size, file_type, quality, language, year
const files = [
    {
        _id: "f1",
        file_name: "Inception_2010_1080p.mkv",
        file_type: "video/x-matroska",
        file_size: 2500000000, // bytes
        quality: "1080p",
        language: "English",
        year: "2010",
        created_at: "2024-02-15T10:00:00Z",
    },
    {
        _id: "f2",
        file_name: "The_Dark_Knight_2008_720p.mp4",
        file_type: "video/mp4",
        file_size: 1200000000,
        quality: "720p",
        language: "English, Hindi",
        year: "2008",
        created_at: "2024-02-14T15:30:00Z",
    },
    {
        _id: "f3",
        file_name: "Interstellar_2014_4K_HDR.mkv",
        file_type: "video/x-matroska",
        file_size: 15000000000,
        quality: "2160p",
        language: "English",
        year: "2014",
        created_at: "2024-02-10T09:20:00Z",
    },
];

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function FileTable() {
    return (
        <Card className="border-0 shadow-none">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Quality</TableHead>
                            <TableHead>Lang</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {files.map((file) => (
                            <TableRow key={file._id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                            <FileIcon className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium truncate max-w-[200px]" title={file.file_name}>
                                                {file.file_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {file.file_type}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{formatBytes(file.file_size)}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{file.quality}</Badge>
                                </TableCell>
                                <TableCell className="max-w-[100px] truncate" title={file.language}>
                                    {file.language}
                                </TableCell>
                                <TableCell>{file.year}</TableCell>
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
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Download className="mr-2 h-4 w-4" /> Download
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
