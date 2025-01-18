import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CourseButtons from "@/components/CourseButtons";
import { GraduationCap, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Profile Icon */}
        <div className="absolute top-4 right-4 cursor-pointer">
          <User className="h-8 w-8 text-primary hover:text-indigo-600 transition-all" />
        </div>

        <div className="text-center mb-16 animate-fade-in-down">
          <GraduationCap className="mx-auto h-20 w-20 text-primary mb-6 animate-bounce" />
          <h1 className="text-5xl font-medium text-primary mb-4 tracking-tight">
            Welcome to LMS Portal
          </h1>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto font-light">
            Your centralized platform for team learning and development
          </p>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto font-light">
              Discover a world of learning opportunities! Enroll in courses and enhance your skills.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[{
            title: "Courses Management",
            description: "Browse through our curated collection of courses designed for your team.",
            route: "/courses",
            label: "View Courses",
          },
          ...(session.user.role === "admin"
            ? [
              {
                title: "Team Management",
                description: "Manage your team members and their roles.",
                route: "/teams",
                label: "Manage Team",
              },
              {
                title: "User Management",
                description: "Manage users for your team.",
                route: "/users",
                label: "Manage Users",
              },
            ]
            : [])]
            .map((item, index) => (
              <div
                key={item.title}
                className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:bg-white/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms `}}
              >
                <h2 className="text-2xl font-bold text-gray mb-4">{item.title}</h2>
                <p className="text-gray-900 mb-6">{item.description}</p>
                <CourseButtons route={item.route} label={item.label} />
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}