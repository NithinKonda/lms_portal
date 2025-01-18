"use client"; // Add the client directive here

import { motion } from "framer-motion";
import { GraduationCap, BookOpen } from "lucide-react";
import PDFViewer from "@/components/PDFViewer";
import CourseProgress from "@/components/CourseProgress";

interface CoursePageClientProps {
  course: any;
  progress: any;
  courseId: string;
}

export default function CoursePageClient({
  course,
  progress,
  courseId,
}: CoursePageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 border-b border-gray-100">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <GraduationCap className="h-8 w-8 text-indigo-500" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {course.title}
                </h1>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:w-3/4 p-8"
            >
              <div className="bg-white rounded-xl shadow-lg">
                <PDFViewer
                  courseId={courseId}
                  materials={course.materials}
                  progress={progress}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:w-1/4 p-8 border-l border-gray-100"
            >
              <div className="sticky top-8">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Course Progress
                  </h2>
                </div>
                <CourseProgress materials={course.materials} progress={progress} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
