import { NextRequest, NextResponse } from "next/server";
const subscriptions: PushSubscription[] = [];

export async function POST(req: NextRequest) {
  const body = await req.json();
  subscriptions.push(body);
  return NextResponse.json({ success: true });
}

export function getSubscriptions() {
  return subscriptions;
}
