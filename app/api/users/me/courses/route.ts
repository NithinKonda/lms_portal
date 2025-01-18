// app/api/users/me/courses/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserProgress } from "@/lib/db/users"; // Import the getUserProgress function

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Fetch the courses the user is enrolled in based on their userId
  const userProgress = await getUserProgress(session.user.id); // Assuming session has `user.id`

  // If no progress found, return an empty array
  if (!userProgress) {
    return NextResponse.json([]);
  }

  return NextResponse.json(userProgress);
}
