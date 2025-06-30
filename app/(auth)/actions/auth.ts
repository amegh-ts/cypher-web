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

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists" };
    }

    // Generate user ID and get current date/time
    const userId = generateUserId();
    const { date, time } = getCurrentDateTime();

    // Hash password and create user
    const hashedPassword = hashPassword(password);
    const user = await User.create({
      _id: userId,
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
      dc_id: null,
      date,
      time,
      permission: true,
    });

    // Set session
    await setSession(user);
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed" };
  }

  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await connectDB();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid credentials" };
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return { error: "Invalid credentials" };
    }

    // Set session
    await setSession(user);
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed" };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
