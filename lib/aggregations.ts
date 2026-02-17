import User from "@/models/User";
import Files from "@/models/Files";
import Groups from "@/models/Groups";
import connectDB from "@/lib/mongodb";

export async function getDashboardStats() {
    await connectDB();

    const [
        totalUsers,
        totalFiles,
        totalGroups,
        recentFiles,
    ] = await Promise.all([
        User.countDocuments(),
        Files.countDocuments(),
        Groups.countDocuments({ status: { $ne: "banned" } }),
        Files.find().sort({ created_at: -1 }).limit(5).lean(),
    ]);

    // Example Aggregation: Files by Type
    const filesByType = await Files.aggregate([
        {
            $group: {
                _id: "$file_type",
                count: { $sum: 1 },
                totalSize: { $sum: "$file_size" },
            },
        },
        { $sort: { count: -1 } },
        { $limit: 4 },
    ]);

    return {
        overview: {
            totalUsers,
            totalFiles,
            totalGroups,
        },
        filesByType,
        recentFiles: JSON.parse(JSON.stringify(recentFiles)),
    };
}
