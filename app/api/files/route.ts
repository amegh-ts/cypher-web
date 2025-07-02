import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import File from "@/models/Files";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const query = search
      ? { file_name: { $regex: search, $options: "i" } }
      : {};

    const files = await File.find(query).skip(skip).limit(limit).lean();

    return NextResponse.json(files);
  } catch (error) {
    console.error("GET /api/files error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
