import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const activities = [
  {
    id: 1,
    user: "kratos_070",
    action: "submitted feedback",
    time: "2 minutes ago",
    status: "pending",
    avatar: "K",
  },
  {
    id: 2,
    user: "Achuuu",
    action: "downloaded file",
    time: "5 minutes ago",
    status: "completed",
    avatar: "A",
  },
  {
    id: 3,
    user: "user_123",
    action: "joined bot",
    time: "10 minutes ago",
    status: "new",
    avatar: "U",
  },
  {
    id: 4,
    user: "movie_fan",
    action: "requested file",
    time: "15 minutes ago",
    status: "processing",
    avatar: "M",
  },
];

interface RecentActivityProps {
  isLoading?: boolean;
}

export function RecentActivity({ isLoading }: RecentActivityProps) {
  return (
    <div className="space-y-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        : activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`/placeholder.svg?height=32&width=32&query=user avatar`}
                />
                <AvatarFallback>{activity.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.action}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge
                  variant={
                    activity.status === "completed"
                      ? "default"
                      : activity.status === "pending"
                      ? "secondary"
                      : activity.status === "new"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {activity.status}
                </Badge>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
    </div>
  );
}
