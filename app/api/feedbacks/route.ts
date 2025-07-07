/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Feedbacks from "@/models/Feedbacks";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const types = searchParams.get("type")?.split(",").filter(Boolean) || [];

    const query: any = {};

    if (search) {
      if (!isNaN(Number(search))) {
        query.user_id = Number(search);
      } else {
        query.$or = [
          { ticket_id: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
        ];
      }
    }

    if (types.length > 0) {
      query.type = { $in: types };
    }

    const feedbacks = await Feedbacks.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("GET /api/files error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
