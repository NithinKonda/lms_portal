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
    <div className="min-h-screen bg-gradient-to-br from-gray-500  to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16 animate-fade-in-down">
          <GraduationCap className="mx-auto h-20 w-20 text-white mb-6 animate-bounce" />
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
            Welcome to LMS Portal
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
            Your centralized platform for team learning and development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[
            {
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
              : []),
          ].map((item, index) => (
            <div
              key={item.title}
              className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:bg-white/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">{item.title}</h2>
              <p className="text-white/70 mb-6">{item.description}</p>
              <CourseButtons route={item.route} label={item.label} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
