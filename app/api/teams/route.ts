import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createTeam, getTeams, getAllUsers } from "@/lib/db/team"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await request.json();
  const result = await createTeam({
    ...data,
    createdBy: session.user.id,
    members: [{
      userId: session.user.id,
      email: session.user.email!,
      role: "admin",
      joinedAt: new Date()
    }]
  });
  
  return NextResponse.json(result);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const [teams, users] = await Promise.all([
    getTeams(),
    getAllUsers()
  ]);
  
  return NextResponse.json({ teams, users });
}