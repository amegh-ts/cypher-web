import { UserTable } from "@/components/dashboard/users/UserTable";
import { AddUserDialog } from "@/components/dashboard/users/AddUserDialog";

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">
                        Manage web access and permissions.
                    </p>
                </div>
                <AddUserDialog />
            </div>
            <UserTable />
        </div>
    );
}
