import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Calendar, Clock, LogOut } from "lucide-react";
import { logoutAction } from "../(auth)/actions/auth";

interface SessionUser {
  userId?: string | number;
  email?: string;
  name?: string;
  role?: string;
}

export default async function WelcomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user: SessionUser = {
    userId: session.userId as string | number,
    email: session.email as string,
    name: session.name as string,
    role: session.role as string,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                CYPHER
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-600 text-white">
                {user.role?.toUpperCase()}
              </Badge>
              <form action={logoutAction}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center mb-6">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CYPHER
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hello {user.name}! You&apos;re successfully logged into the CYPHER
            system. Your account is active and ready to use.
          </p>
        </div>

        {/* User Info Card */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your current account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <span className="text-sm font-semibold">{user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Email:
                </span>
                <span className="text-sm font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Role:</span>
                <Badge className="bg-blue-600 text-white">
                  {user.role?.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  User ID:
                </span>
                <span className="text-sm font-mono">{user.userId}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>Current system information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Status:
                </span>
                <Badge className="bg-green-600 text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Access Level:
                </span>
                <span className="text-sm font-semibold">Standard User</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Last Login:
                </span>
                <span className="text-sm font-semibold">Just now</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Session:
                </span>
                <Badge className="bg-blue-600 text-white">Valid</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">You&apos;re All Set!</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Your CYPHER account is active and ready to use. If you need
                access to additional features or have any questions, please
                contact your system administrator.
              </p>
              <div className="flex items-center justify-center space-x-6 text-blue-100">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="text-sm">Account Active</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="text-sm">24/7 Access</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="text-sm">Secure Connection</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Need help? Contact your system administrator or check the
            documentation.
          </p>
        </div>
      </main>
    </div>
  );
}
