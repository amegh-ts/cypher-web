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
  const pendingFeedbacks = await Feedbacks.countDocuments({
    status: "Pending",
  });
  const thisMonthFeedbacks = await Feedbacks.countDocuments({
    date: { $regex: `.*-${currentMonth}-.*` },
    status: "Pending",
  });
  const lastMonthFeedbacks = await Feedbacks.countDocuments({
    date: { $regex: `.*-${lastMonth}-.*` },
    status: "Pending",
  });
  const feedbackGrowth =
    lastMonthFeedbacks === 0
      ? 0
      : ((thisMonthFeedbacks - lastMonthFeedbacks) / lastMonthFeedbacks) * 100;

  // Files
  const totalFiles = await Files.countDocuments();
  const thisMonthFiles = await Files.countDocuments({
    created_at: {
      $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    },
  });
  const lastMonthFiles = await Files.countDocuments({
    created_at: {
      $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      $lt: new Date(now.getFullYear(), now.getMonth(), 1),
    },
  });
  const fileGrowth =
    lastMonthFiles === 0
      ? thisMonthFiles * 100
      : ((thisMonthFiles - lastMonthFiles) / lastMonthFiles) * 100;

  const fileSizes = await Files.aggregate([
    { $group: { _id: null, totalSize: { $sum: "$file_size" } } },
  ]);
  const totalStorageUsed = fileSizes[0]?.totalSize || 0;

  // Graph Data (last 6 months)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const usersByMonth = await User.aggregate([
    {
      $match: {
        $expr: {
          $gte: [
            {
              $dateFromString: {
                dateString: "$date",
                format: "%d-%m-%Y",
              },
            },
            sixMonthsAgo,
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%m-%Y",
            date: {
              $dateFromString: {
                dateString: "$date",
                format: "%d-%m-%Y",
              },
            },
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const filesByMonth = await Files.aggregate([
    {
      $match: {
        created_at: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%m-%Y", date: "$created_at" } },
        count: { $sum: 1 },
      },
    },
  ]);

  const monthlyStats: Record<string, { users: number; files: number }> = {};

  usersByMonth.forEach((entry) => {
    const month = entry._id as string;
    if (!monthlyStats[month]) monthlyStats[month] = { users: 0, files: 0 };
    monthlyStats[month].users = entry.count;
  });

  filesByMonth.forEach((entry) => {
    const month = entry._id as string;
    if (!monthlyStats[month]) monthlyStats[month] = { users: 0, files: 0 };
    monthlyStats[month].files = entry.count;
  });

  const graph = Object.keys(monthlyStats)
    .map((month) => {
      const [mm, yyyy] = month.split("-");
      const label = new Intl.DateTimeFormat("en", { month: "short" }).format(
        new Date(+yyyy, +mm - 1)
      );
      return {
        month: label,
        users: monthlyStats[month].users,
        files: monthlyStats[month].files,
      };
    })
    .sort(
      (a, b) =>
        new Date(`01 ${a.month} ${now.getFullYear()}`).getTime() -
        new Date(`01 ${b.month} ${now.getFullYear()}`).getTime()
    )
    .slice(-6);

  return NextResponse.json({
    totalUsers,
    userGrowth: Math.round(userGrowth),
    pendingFeedbacks,
    feedbackGrowth: Math.round(feedbackGrowth),
    totalFiles,
    fileGrowth: Math.round(fileGrowth),
    totalStorageUsed,
    graph,
  });
}
