"use client";

import { CheckCircle, Circle } from "lucide-react";

interface CourseProgressProps {
  materials: {
    title: string;
    pdfUrl: string;
    order: number;
  }[];
  progress: {
    completedMaterials: string[];
  };
}

export default function CourseProgress({
  materials,
  progress,
}: CourseProgressProps) {
  const completedCount = progress?.completedMaterials?.length || 0;
  const totalCount = materials.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Course Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedCount} of {totalCount} completed ({progressPercentage}%)
        </p>
      </div>

      <div className="space-y-4">
        {materials.map((material) => (
          <div
            key={material.pdfUrl}
            className="flex items-center gap-3"
          >
            {progress?.completedMaterials?.includes(material.pdfUrl) ? (
              <CheckCircle className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
            <span className="text-sm">{material.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}