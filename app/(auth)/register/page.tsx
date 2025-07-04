"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { registerAction } from "../actions/auth";
import { useFormState } from "react-dom";

const initialState = { message: "" };

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, initialState);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl rounded-2xl animate-fade-in">
        <CardHeader className="space-y-1 text-white">
          <CardTitle className="text-3xl font-extrabold text-center tracking-tight">
            Create Admin Account
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Register to manage your CYPHER panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                className="bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {state?.message && (
              <div className="text-red-500 text-sm">{state.message}</div>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
            >
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-500 font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
