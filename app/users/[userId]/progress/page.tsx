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
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";

interface CourseProgress {
  userId: string;
  courseId: string;
  completedMaterials: string[];
  lastAccessedAt: Date;
  course: {
    _id: string;
    title: string;
    description: string;
    materials: {
      title: string;
      pdfUrl: string;
      order: number;
    }[];
  };
}

export default function UserProgressPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const [progress, setProgress] = useState<CourseProgress[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      const response = await fetch(`/api/users/${params.userId}/progress`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    };

    fetchProgress();
  }, [params.userId]);

  const calculateProgress = (courseProgress: CourseProgress) => {
    const totalMaterials = courseProgress.course.materials.length;
    const completedMaterials = courseProgress.completedMaterials.length;
    return Math.round((completedMaterials / totalMaterials) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/users")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Progress</h1>
            </div>
          </div>

          {progress.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Last Accessed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {progress.map((p) => (
                  <TableRow key={p.courseId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        {p.course.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${calculateProgress(p)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {calculateProgress(p)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(p.lastAccessedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {p.completedMaterials ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </div>
                      ) : (
                        <span className="text-blue-600">In Progress</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No course progress found for this user.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}