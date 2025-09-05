// app/api/feedbacks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Feedbacks from "@/models/Feedbacks";
import { cookies } from "next/headers";
import { Types } from "mongoose";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1) Pull out and await the params
    const { id } = await context.params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // 2) Auth
    const cookieStore = cookies();
    const token = (await cookieStore).get("cypher-session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Please log in" }, { status: 401 });
    }
    const decoded = await verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 3) Body + validation
    const { status } = (await request.json()) as { status: string };
    if (!["Resolved", "Pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 4) Update DB
    await connectDB();
    const updated = await Feedbacks.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 5) Success
    return NextResponse.json({ message: "Status updated", data: updated });
  } catch (err) {
    console.error("PATCH /api/feedbacks/[id] error", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
