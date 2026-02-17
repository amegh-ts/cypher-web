import Logs from "@/models/Logs";
import connectDB from "../mongodb";

let indexesInitialized = false;

export async function initLogIndexes() {
  if (indexesInitialized) return;

  await connectDB();
  await Promise.all([
    Logs.collection.createIndex({ _id: 1 }),
    Logs.collection.createIndex({ type: 1 }),
  ]);

  indexesInitialized = true;
}
