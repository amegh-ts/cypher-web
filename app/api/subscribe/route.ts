import { NextRequest, NextResponse } from "next/server";
import { addSubscription } from "@/lib/push-store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  addSubscription(body);
  return NextResponse.json({ success: true });
}
