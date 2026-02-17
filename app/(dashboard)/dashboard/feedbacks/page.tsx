import { FeedbackTable } from "@/components/dashboard/feedbacks/FeedbackTable";

export default function FeedbacksPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Feedbacks</h2>
                <p className="text-muted-foreground">
                    View user reports and feature requests.
                </p>
            </div>
            <FeedbackTable />
        </div>
    );
}
