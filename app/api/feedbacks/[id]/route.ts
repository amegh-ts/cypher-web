import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Feedbacks from "@/models/Feedbacks";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!["Resolved", "Pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    const updated = await Feedbacks.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Status updated", data: updated });
  } catch (error) {
    console.error("PATCH /api/feedbacks/[id] error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
