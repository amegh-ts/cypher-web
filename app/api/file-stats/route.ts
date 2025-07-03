import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import File from "@/models/Files";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

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

    const files = await File.find(
      {},
      {
        file_size: 1,
        file_type: 1,
        file_name: 1,
      }
    ).lean();

    const totalFiles = files.length;
    const totalSize = files.reduce(
      (acc, file) => acc + (file.file_size || 0),
      0
    );
    const avgSize = totalFiles > 0 ? totalSize / totalFiles : 0;
    const videoCount = files.filter((f) =>
      f.file_type?.startsWith("video")
    ).length;

    const extMap: Record<string, number> = {};
    const typeMap: Record<string, number> = {};

    files.forEach((file) => {
      const ext = file.file_name?.split(".").pop()?.toLowerCase() || "unknown";
      extMap[ext] = (extMap[ext] || 0) + 1;

      const type = file.file_type?.split("/")?.[0] || "unknown";
      typeMap[type] = (typeMap[type] || 0) + 1;
    });

    return NextResponse.json({
      totalFiles,
      totalSize,
      avgSize,
      videoCount,
      typeCounts: typeMap,
    });
  } catch (error) {
    console.error("GET /api/file-stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch file stats" },
      { status: 500 }
    );
  }
}
