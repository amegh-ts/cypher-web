import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import File from "@/models/Files";
import { verifyToken } from "@/lib/auth";
import { initIndexes } from "@/lib/index/fileIndexes";

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
    await initIndexes();

    const [stats] = await File.aggregate([
      {
        $facet: {
          total: [{ $count: "totalFiles" }],
          size: [{ $group: { _id: null, totalSize: { $sum: "$file_size" } } }],
          videoCount: [
            { $match: { file_type: { $regex: "^video" } } },
            { $count: "count" },
          ],
          typeCounts: [
            {
              $group: {
                _id: { $arrayElemAt: [{ $split: ["$file_type", "/"] }, 0] },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const totalFiles = stats.total?.[0]?.totalFiles || 0;
    const totalSize = stats.size?.[0]?.totalSize || 0;
    const avgSize = totalFiles > 0 ? totalSize / totalFiles : 0;
    const videoCount = stats.videoCount?.[0]?.count || 0;

    const typeCounts: Record<string, number> = {};
    for (const t of stats.typeCounts || []) {
      typeCounts[t._id || "unknown"] = t.count;
    }

    return NextResponse.json({
      totalFiles,
      totalSize,
      avgSize,
      videoCount,
      typeCounts,
    });
  } catch (err) {
    console.error("GET /api/files/stats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
