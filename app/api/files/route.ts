import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import File from "@/models/Files";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

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

    const query = search
      ? { file_name: { $regex: search, $options: "i" } }
      : {};

    const files = await File.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json(files);
  } catch (error) {
    console.error("GET /api/files error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
