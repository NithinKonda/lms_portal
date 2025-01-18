import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getCourse, getCourseProgress } from "@/lib/db/courses";
import CoursePageClient from "@/components/CoursePageClient";

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
    <CoursePageClient course={course} progress={progress} courseId={params.courseId} />
  );
}
