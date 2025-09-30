/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient } from "mongodb";
import { config } from "./config";

const uri = config.mongodb.uri;

if (!uri) {
  throw new Error("Please define MONGODB_URI in your .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// ✅ Safe caching in dev, normal in prod
if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
