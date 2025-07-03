import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Logs from "@/models/Logs";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("cypher-session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Please log in" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const todayStr = `${dd}-${mm}-${yyyy}`;

    const [
      total,
      todayCount,
      userActions,
      groupActions,
      adminActions,
      botActions,
    ] = await Promise.all([
      Logs.countDocuments(),
      Logs.countDocuments({ date: todayStr }),
      Logs.countDocuments({ type: "USER_ACTION" }),
      Logs.countDocuments({ type: "GROUP_ACTION" }),
      Logs.countDocuments({ type: "ADMIN_ACTION" }),
      Logs.countDocuments({ type: "BOT_ACTION" }),
    ]);

    return NextResponse.json({
      total,
      today: todayCount,
      types: {
        USER_ACTION: userActions,
        GROUP_ACTION: groupActions,
        ADMIN_ACTION: adminActions,
        BOT_ACTION: botActions,
      },
    });
  } catch (error) {
    console.error("GET /api/logs/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch log stats" },
      { status: 500 }
    );
  }
}
