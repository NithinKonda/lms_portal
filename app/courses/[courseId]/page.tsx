import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getCourse, getCourseProgress } from "@/lib/db/courses";
import { Button } from "@/components/ui/button";
import PDFViewer from "@/components/PDFViewer";
import CourseProgress from "@/components/CourseProgress";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const course = await getCourse(params.courseId);
  const progress = await getCourseProgress(session.user.id, params.courseId);

  if (!course) {
    redirect("/courses");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-2">{course.description}</p>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-3/4 p-6">
              <PDFViewer
                courseId={params.courseId}
                materials={course.materials}
                progress={progress}
              />
            </div>

            <div className="lg:w-1/4 p-6 border-l">
              <CourseProgress
                materials={course.materials}
                progress={progress}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}