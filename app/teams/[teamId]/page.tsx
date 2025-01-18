"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { UserPlus, Users, X } from "lucide-react";

interface User {
  _id: string;
  email: string;
  role: string;
}

interface TeamMember {
  userId: string;
  email: string;
  role: string;
  joinedAt: Date;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  members: TeamMember[];
}

export default function TeamPage({ params }: { params: { teamId: string } }) {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [teamResponse, usersResponse] = await Promise.all([
        fetch(`/api/teams/${params.teamId}`),
        fetch("/api/teams")
      ]);

      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeam(teamData);
      }

      if (usersResponse.ok) {
        const { users } = await usersResponse.json();
        setUsers(users);
      }
    };

    fetchData();
  }, [params.teamId]);

  const addMember = async () => {
    if (!selectedUser || !team) return;

    const user = users.find(u => u._id === selectedUser);
    if (!user) return;

    const updatedMembers = [
      ...team.members,
      {
        userId: user._id,
        email: user.email,
        role: "member",
        joinedAt: new Date()
      }
    ];

    const response = await fetch(`/api/teams/${team._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        members: updatedMembers
      }),
    });

    if (response.ok) {
      setTeam({
        ...team,
        members: updatedMembers
      });
      setSelectedUser("");
    }
  };

  const removeMember = async (userId: string) => {
    if (!team) return;

    const updatedMembers = team.members.filter(member => member.userId !== userId);

    const response = await fetch(`/api/teams/${team._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        members: updatedMembers
      }),
    });

    if (response.ok) {
      setTeam({
        ...team,
        members: updatedMembers
      });
    }
  };

  if (!team) {
    return <div>Loading...</div>;
  }

  const availableUsers = users.filter(
    user => !team.members.some(member => member.userId === user._id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-8">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-gray-600 mt-1">{team.description}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-end gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Team Member
                </label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select a user</option>
                  {availableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={addMember} disabled={!selectedUser}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.members.map((member) => (
                  <TableRow key={member.userId}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="capitalize">{member.role}</TableCell>
                    <TableCell>
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {member.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(member.userId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => router.push("/teams")}
            >
              Back to Teams
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}