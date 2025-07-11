import User from "@/models/User";
import connectDB from "../mongodb";

let indexesInitialized = false;

export async function initUserIndexes() {
  if (indexesInitialized) return;

  await connectDB();
  await Promise.all([
    User.collection.createIndex({ _id: 1 }),
    User.collection.createIndex({ name: 1 }),
  ]);

  indexesInitialized = true;
}
