import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserProgress } from "@/lib/db/users";
import { getCourses } from "@/lib/db/courses";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const [progress, courses] = await Promise.all([
    getUserProgress(params.userId),
    getCourses()
  ]);

  const progressWithCourses = progress.map(p => ({
    ...p,
    course: courses.find(c => c._id.toString() === p.courseId)
  }));

  return NextResponse.json(progressWithCourses);
}