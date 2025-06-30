"use server";

import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import {
  hashPassword,
  verifyPassword,
  setSession,
  clearSession,
} from "@/lib/auth";
import User from "@/models/User";

function generateUserId(): number {
  return Math.floor(Math.random() * 9000000000) + 1000000000;
}

function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-GB").replace(/\//g, "-");
  const time = now.toLocaleTimeString("en-GB", { hour12: false });
  return { date, time };
}

export async function registerAction(formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const userId = generateUserId();
  const { date, time } = getCurrentDateTime();

  const hashedPassword = hashPassword(password);
  const user = await User.create({
    _id: userId,
    name,
    email,
    password: hashedPassword,
    role: "user",
    dc_id: null,
    date,
    time,
    permission: true,
  });

  await setSession(user);

  redirect("/dashboard");
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  await setSession(user);

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
