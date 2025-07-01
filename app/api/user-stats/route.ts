import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const total = await User.countDocuments();
    const active = await User.countDocuments({ permission: true });
    const blocked = await User.countDocuments({ permission: false });

    // "dd-mm-yyyy" format
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const todayStr = `${day}-${month}-${year}`;

    const newToday = await User.countDocuments({ date: todayStr });

    return NextResponse.json({ total, active, blocked, newToday });
  } catch (error) {
    console.error("GET /api/user-stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
