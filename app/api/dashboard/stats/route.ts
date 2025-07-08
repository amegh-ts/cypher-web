import Feedbacks from "@/models/Feedbacks";
import Files from "@/models/Files";
import Logs from "@/models/Logs";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const now = new Date();

  // Users
  const totalUsers = await User.countDocuments();
  const thisMonthUsers = await User.countDocuments({
    date: { $regex: `.*-${String(now.getMonth() + 1).padStart(2, "0")}-.*` },
  });
  const lastMonthUsers = await User.countDocuments({
    date: { $regex: `.*-${String(now.getMonth()).padStart(2, "0")}-.*` },
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
    date: { $regex: `.*-${String(now.getMonth() + 1).padStart(2, "0")}-.*` },
  });

  // Files
  const totalFiles = await Files.countDocuments();
  const fileSizes = await Files.aggregate([
    { $group: { _id: null, totalSize: { $sum: "$file_size" } } },
  ]);
  const totalStorageUsed = fileSizes[0]?.totalSize || 0;

  // Monthly Graph Data (last 6 months)
  const logsByMonth = await Logs.aggregate([
    {
      $group: {
        _id: { $substr: ["$date", 3, 2] },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const graph = logsByMonth.map((entry) => ({
    month: entry._id,
    actions: entry.count,
  }));

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
