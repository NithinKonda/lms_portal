import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getCourses } from "@/lib/db/courses";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, BookOpen } from "lucide-react";

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
          {session.user.role === "admin" && (
            <Link href="/courses/create">
              <Button>Create New Course</Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {course.materials.length} materials
                  </span>
                  <Link href={`/courses/${course._id}`}>
                    <Button variant="outline">Start Learning</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}