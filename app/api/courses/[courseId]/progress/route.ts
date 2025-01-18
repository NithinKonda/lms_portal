import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateCourseProgress, getCourseProgress } from "@/lib/db/courses";

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await request.json();
  const progress = await updateCourseProgress({
    userId: session.user.id,
    courseId: params.courseId,
    ...data,
  });
  
  return NextResponse.json(progress);
}

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const progress = await getCourseProgress(session.user.id, params.courseId);
  return NextResponse.json(progress);
}