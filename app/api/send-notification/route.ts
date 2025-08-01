/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/send-notification/route.ts
import { NextResponse } from "next/server";
import webpush from "@/lib/webpush";
import { getSubscriptions } from "../subscribe/route";
import type { PushSubscription as WebPushSubscription } from "web-push";

function toWebPushSubscription(sub: any): WebPushSubscription | null {
  const json = sub?.toJSON?.();
  if (!json?.keys?.auth || !json?.keys?.p256dh) return null;

  return {
    endpoint: sub.endpoint,
    expirationTime: sub.expirationTime,
    keys: {
      auth: json.keys.auth,
      p256dh: json.keys.p256dh,
    },
  };
}

export async function POST() {
  const subscriptions = getSubscriptions();

  const notificationPayload = {
    title: "Hello!",
    body: "This is a test push notification",
  };

  await Promise.allSettled(
    subscriptions
      .map((sub) => toWebPushSubscription(sub))
      .filter(Boolean) // removes nulls
      .map((sub) =>
        webpush.sendNotification(sub!, JSON.stringify(notificationPayload))
      )
  );

  return NextResponse.json({ success: true });
}
