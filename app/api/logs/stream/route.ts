/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb-client";
import { ChangeStreamInsertDocument } from "mongodb";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db("CYPHER");
  const logs = db.collection("logs");

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const changeStream = logs.watch([], {
    fullDocument: "updateLookup",
  });

  changeStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const { fullDocument } = change as ChangeStreamInsertDocument<any>;

      if (fullDocument) {
        const payload = `data: ${JSON.stringify(fullDocument)}\n\n`;
        await writer.write(encoder.encode(payload));
      }
    }
  });

  const keepAlive = setInterval(() => {
    writer.write(encoder.encode(": keep-alive\n\n"));
  }, 15000);

  request.signal?.addEventListener("abort", () => {
    clearInterval(keepAlive);
    changeStream.close();
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
