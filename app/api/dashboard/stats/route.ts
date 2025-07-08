// /app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Feedbacks from "@/models/Feedbacks";
import Files from "@/models/Files";

export async function GET() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
  const lastMonth = String(now.getMonth()).padStart(2, "0");

  // Users
  const totalUsers = await User.countDocuments();
  const thisMonthUsers = await User.countDocuments({
    date: { $regex: `.*-${currentMonth}-.*` },
  });
  const lastMonthUsers = await User.countDocuments({
    date: { $regex: `.*-${lastMonth}-.*` },
  });

  const userGrowth =
    lastMonthUsers === 0
      ? 100
      : ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;

  // Feedback
  const totalFeedbacks = await Feedbacks.countDocuments();
  const pendingFeedbacks = await Feedbacks.countDocuments({
    status: "Pending",
  });
  const feedbackThisMonth = await Feedbacks.countDocuments({
    date: { $regex: `.*-${currentMonth}-.*` },
  });

  // Files
  const totalFiles = await Files.countDocuments();
  const fileSizes = await Files.aggregate([
    { $group: { _id: null, totalSize: { $sum: "$file_size" } } },
  ]);
  const totalStorageUsed = fileSizes[0]?.totalSize || 0;

  // Graph Data (aggregated)
  const usersByMonth = await User.aggregate([
    {
      $group: {
        _id: { $substr: ["$date", 3, 2] },
        count: { $sum: 1 },
      },
    },
  ]);

  const filesByMonth = await Files.aggregate([
    {
      $group: {
        _id: { $toString: { $month: "$created_at" } },
        count: { $sum: 1 },
      },
    },
  ]);

  const monthlyStats: Record<string, { users: number; files: number }> = {};

  usersByMonth.forEach((entry) => {
    const month = entry._id;
    if (!monthlyStats[month]) monthlyStats[month] = { users: 0, files: 0 };
    monthlyStats[month].users = entry.count;
  });

  filesByMonth.forEach((entry) => {
    const month = entry._id.padStart(2, "0");
    if (!monthlyStats[month]) monthlyStats[month] = { users: 0, files: 0 };
    monthlyStats[month].files = entry.count;
  });

  const graph = Object.keys(monthlyStats)
    .map((month) => ({
      month,
      users: monthlyStats[month].users,
      files: monthlyStats[month].files,
    }))
    .sort((a, b) => Number(a.month) - Number(b.month));

  return NextResponse.json({
    totalUsers,
    thisMonthUsers,
    lastMonthUsers,
    userGrowth: Math.round(userGrowth),
    totalFeedbacks,
    pendingFeedbacks,
    feedbackThisMonth,
    totalFiles,
    totalStorageUsed,
    graph,
  });
}
