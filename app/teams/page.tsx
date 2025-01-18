import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getTeams, getAllUsers } from "@/lib/db/team";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, UserPlus } from "lucide-react";

export default async function TeamsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const [teams, users] = await Promise.all([getTeams(), getAllUsers()]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <Link href="/teams/create">
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Create New Team
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">{team.name}</h2>
                </div>
                <p className="text-gray-600 mb-4">{team.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {team.members.length} members
                  </span>
                  <Link href={`/teams/${team._id}`}>
                    <Button variant="outline">Manage Team</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}