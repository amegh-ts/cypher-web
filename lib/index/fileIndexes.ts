import File from "@/models/Files";
import connectDB from "../mongodb";

let indexesInitialized = false;

export async function initIndexes() {
  if (indexesInitialized) return;

  await connectDB();
  await Promise.all([
    File.collection.createIndex({ file_type: 1 }),
    File.collection.createIndex({ file_name: 1 }),
    File.collection.createIndex({ file_size: 1 }),
  ]);

  indexesInitialized = true;
}
