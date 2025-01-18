import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CourseButtons from "@/components/CourseButtons";
import { GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <GraduationCap className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to LMS Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your centralized platform for team learning and development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
            <p className="text-gray-600 mb-4">
              Browse through our curated collection of courses designed for your team.
            </p>
            <CourseButtons route="/courses" label="View Courses" />
          </div>

          {session.user.role === "admin" && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Team Management</h2>
                <p className="text-gray-600 mb-4">
                  Manage your team members and their roles.
                </p>
                <CourseButtons route="/teams" label="Manage Team" />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Course Management</h2>
                <p className="text-gray-600 mb-4">
                  Create and manage courses for your team.
                </p>
                <CourseButtons route="/courses" label="Manage Courses" />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
