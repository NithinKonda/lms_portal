// app/api/users/me/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getUserById } from "@/lib/db/users"; // Import getUserById

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Fetch the logged-in user's details
  const user = await getUserById(session.user.id); // Assuming the session has `user.id`
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  return NextResponse.json(user);
}
