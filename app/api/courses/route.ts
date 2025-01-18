import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createCourse, getCourses } from "@/lib/db/courses";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await request.json();
  const result = await createCourse(data);
  
  return NextResponse.json(result);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const courses = await getCourses();
  return NextResponse.json(courses);
}