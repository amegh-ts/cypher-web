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
import { MessageSquare, CheckCircle, Ban, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/_ui/Card";

// Mock data based on Feedbacks schema
// user_id, username, feedback, ticket_id, status, type, timestamp
const feedbacks = [
    {
        ticket_id: "TKT-1234",
        username: "john_doe",
        feedback: "The bot is not responding to /start command in group chat.",
        type: "report",
        status: "Pending",
        timestamp: "2024-02-17T11:00:00Z",
    },
    {
        ticket_id: "TKT-5678",
        username: "jane_smith",
        feedback: "Love the new search feature! Can you add filters by year?",
        type: "feedback",
        status: "Resolved",
        timestamp: "2024-02-16T15:30:00Z",
    },
    {
        ticket_id: "TKT-9012",
        username: "movie_buff",
        feedback: "Cannot download file #12345, getting 404 error.",
        type: "report",
        status: "Pending",
        timestamp: "2024-02-17T09:20:00Z",
    },
];

export function FeedbackTable() {
    return (
        <Card className="border-0 shadow-none">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ticket ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="w-[40%]">Feedback</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feedbacks.map((item) => (
                            <TableRow key={item.ticket_id}>
                                <TableCell className="font-medium text-xs">
                                    {item.ticket_id}
                                </TableCell>
                                <TableCell>@{item.username}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            item.type === "report"
                                                ? "border-destructive text-destructive"
                                                : "border-primary text-primary"
                                        }
                                    >
                                        {item.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="truncate max-w-[300px]" title={item.feedback}>
                                    {item.feedback}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={item.status === "Resolved" ? "default" : "secondary"}
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell suppressHydrationWarning>
                                    {new Date(item.timestamp).toLocaleDateString()}
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
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                <Ban className="mr-2 h-4 w-4" /> Block User
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

import { MoreHorizontal } from "lucide-react";
