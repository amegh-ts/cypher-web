import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/placeholder-user.jpg`} />
            <AvatarFallback>{activity.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
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
