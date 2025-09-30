import { type NextRequest, NextResponse } from "next/server";
import { verifyToken, canAccessAdminPanel } from "@/lib/auth";
import { config as sessionConfig } from "@/lib/config";

const protectedRoutes = [
  "/dashboard",
  "/users",
  "/files",
  "/feedback",
  "/settings",
];
const adminRoutes = [
  "/dashboard",
  "/users",
  "/files",
  "/feedback",
  "/settings",
];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  const token = request.cookies.get(sessionConfig.session.cookieName)?.value;
  const session = token ? await verifyToken(token) : null;

  if (session && session.role === "user") {
    console.log("User role:", session.role);
  }

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Check admin access for admin routes
  if (isAdminRoute && session) {
    const userRole = (session.role as string)?.toLowerCase();
    console.log("Admin route access check - role:", userRole);
    const canAccess = canAccessAdminPanel(userRole);
    console.log("Can access admin panel:", canAccess);
    if (!canAccess) {
      return NextResponse.redirect(new URL("/welcome", request.nextUrl));
    }
  }

  // Redirect based on role if accessing auth routes with valid session
  if (isAuthRoute && session) {
    const userRole = session.role as string;
    if (canAccessAdminPanel(userRole)) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    } else {
      return NextResponse.redirect(new URL("/welcome", request.nextUrl));
    }
  }

  // Redirect root based on session and role
  if (path === "/") {
    if (session) {
      const userRole = session.role as string;
      if (canAccessAdminPanel(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
      } else {
        return NextResponse.redirect(new URL("/welcome", request.nextUrl));
      }
    } else {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
