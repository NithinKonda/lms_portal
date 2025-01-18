import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getAllUsers } from "@/lib/db/users";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, BookOpen, BarChart, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const users = await getAllUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 animate-fade-in-down">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">
              Manage users and track their learning progress
            </p>
          </div>
          <Button className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300">
            <UserPlus className="h-5 w-5 mr-2" />
            Add New User
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-600">Email</TableHead>
                  <TableHead className="font-semibold text-gray-600">Role</TableHead>
                  <TableHead className="font-semibold text-gray-600">Name</TableHead>
                  <TableHead className="font-semibold text-gray-600 w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow 
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium text-gray-900">{user.email}</TableCell>
                    <TableCell className="capitalize text-gray-600">{user.role}</TableCell>
                    <TableCell className="text-gray-600">{user.name || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/users/${user._id}/courses`}>
                          <Button variant="outline" size="sm" className="text-indigo-600 hover:text-white hover:bg-indigo-600 transition-colors duration-300">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Courses
                          </Button>
                        </Link>
                        <Link href={`/users/${user._id}/progress`}>
                          <Button variant="outline" size="sm" className="text-green-600 hover:text-white hover:bg-green-600 transition-colors duration-300">
                            <BarChart className="h-4 w-4 mr-2" />
                            Progress
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}