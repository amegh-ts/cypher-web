import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Feedbacks from "@/models/Feedbacks";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getTodayDateString() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("cypher-session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Please log in" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const total = await Feedbacks.countDocuments();
    const resolved = await Feedbacks.countDocuments({ status: "Resolved" });
    const pending = await Feedbacks.countDocuments({
      status: { $ne: "Resolved" },
    });

    const typeAggregation = await Feedbacks.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const types = typeAggregation.reduce((acc, curr) => {
      if (curr._id) {
        acc[curr._id] = curr.count;
      }
      return acc;
    }, {});

    const todayStr = getTodayDateString();
    const today = await Feedbacks.countDocuments({ date: todayStr });

    return NextResponse.json({
      total,
      resolved,
      pending,
      today,
      types,
    });
  } catch (error) {
    console.error("GET /api/users/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
