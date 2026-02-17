import { NotificationList } from "@/components/dashboard/notifications/NotificationList";
import { Button } from "@/components/_ui/Button";
import { CheckCheck } from "lucide-react";

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
                    <p className="text-muted-foreground">
                        System alerts and important updates.
                    </p>
                </div>
                <Button variant="outline">
                    <CheckCheck className="mr-2 h-4 w-4" /> Mark all read
                </Button>
            </div>
            <div className="max-w-3xl">
                <NotificationList />
            </div>
        </div>
    );
}
