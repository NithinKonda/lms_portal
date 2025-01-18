"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  courseId: string;
  materials: {
    title: string;
    pdfUrl: string;
    order: number;
  }[];
  progress: any;
}

export default function PDFViewer({ courseId, materials, progress }: PDFViewerProps) {
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);

  const currentMaterial = materials[currentMaterialIndex];

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  async function markAsCompleted() {
    const response = await fetch(`/api/courses/${courseId}/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completedMaterials: [
          ...(progress?.completedMaterials || []),
          currentMaterial.pdfUrl,
        ],
        lastAccessedAt: new Date(),
      }),
    });

    if (response.ok && currentMaterialIndex < materials.length - 1) {
      setCurrentMaterialIndex(currentMaterialIndex + 1);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full bg-gray-100 rounded-lg p-4 mb-4">
        <Document
          file={currentMaterial.pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            width={Math.min(800, window.innerWidth - 64)}
          />
        </Document>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <span className="text-sm text-gray-600">
          Page {pageNumber} of {numPages}
        </span>

        <Button
          onClick={() => setPageNumber(Math.min(numPages!, pageNumber + 1))}
          disabled={pageNumber >= numPages!}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-8 w-full">
        <Button
          className="w-full"
          onClick={markAsCompleted}
          disabled={progress?.completedMaterials?.includes(currentMaterial.pdfUrl)}
        >
          {progress?.completedMaterials?.includes(currentMaterial.pdfUrl)
            ? "Completed"
            : "Mark as Completed"}
        </Button>
      </div>
    </div>
  );
}