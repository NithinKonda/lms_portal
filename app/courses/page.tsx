import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getCourses } from "@/lib/db/courses";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, BookOpen, Plus } from 'lucide-react';

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 animate-fade-in-down">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Courses</h1>
            <p className="text-gray-600">Expand your knowledge with our curated courses</p>
          </div>
          {session.user.role === "admin" && (
            <Link href="/courses/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Create New Course
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                    {course.materials.length} materials
                  </span>
                  <Link href={`/courses/${course._id}`}>
                    <Button variant="outline" className="hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                      Start Learning
                    </Button>
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
