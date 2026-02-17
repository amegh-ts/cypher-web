import { FileTable } from "@/components/dashboard/files/FileTable";
import { Button } from "@/components/_ui/Button";
import { Upload } from "lucide-react";

export default function FilesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Files</h2>
                    <p className="text-muted-foreground">
                        Manage your index and media content.
                    </p>
                </div>
                <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload File
                </Button>
            </div>
            <FileTable />
        </div>
    );
}
