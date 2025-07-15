/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Feedbacks from "@/models/Feedbacks";
import { Types } from "mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
    const status = searchParams.get("status")?.split(",").filter(Boolean) || [];

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

    if (status.length > 0) {
      query.status = { $in: status };
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

export async function PATCH(request: NextRequest) {
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

    const { ids, status } = (await request.json()) as {
      ids: string[];
      status: string;
    };

    if (!["Resolved", "Pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

    await connectDB();
    const result = await Feedbacks.updateMany(
      { _id: { $in: validIds } },
      { $set: { status } }
    );

    return NextResponse.json({
      message: "Bulk update successful",
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("PATCH /api/feedbacks/bulk-update error", err);
    return NextResponse.json({ error: "Bulk update failed" }, { status: 500 });
  }
}
