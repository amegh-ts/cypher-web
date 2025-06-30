/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from "crypto-js";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { config } from "./config";

const SECRET_KEY = config.jwt.secret;
const key = new TextEncoder().encode(SECRET_KEY);

export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  return CryptoJS.SHA256(password).toString() === hashedPassword;
}

export async function createToken(payload: Record<string, any>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.session.cookieName)?.value;

  if (!token) return null;

  return await verifyToken(token);
}

export async function setSession(user: Record<string, any>) {
  const token = await createToken({
    userId: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(config.session.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: config.session.timeout,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(config.session.cookieName);
}

export function hasPermission(
  userRole: string,
  requiredRoles: string[]
): boolean {
  return requiredRoles.includes(userRole);
}

export function canAccessAdminPanel(userRole: string): boolean {
  return hasPermission(userRole, ["admin", "owner"]);
}

export function canAccessUserModule(userRole: string): boolean {
  return hasPermission(userRole, ["owner"]);
}
