import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { updateTeam,getTeam } from "@/lib/db/team";

export async function PUT(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await request.json();
  const result = await updateTeam(params.teamId, data);
  
  return NextResponse.json(result);
}

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const team = await getTeam(params.teamId);
  
  if (!team) {
    return new NextResponse("Team not found", { status: 404 });
  }

  const isMember = team.members.some(member => member.userId === session.user.id);
  
  if (!isMember && session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.json(team);
}