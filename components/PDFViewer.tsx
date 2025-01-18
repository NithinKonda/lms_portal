"use client"
import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Check, Loader2, Type } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFViewerProps {
  courseId: string
  materials: {
    title: string
    pdfUrl: string
    order: number
  }[]
  progress: any
}

export default function PDFViewer({
  courseId,
  materials,
  progress,
}: PDFViewerProps) {
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0)
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showParsedText, setShowParsedText] = useState(true)  // New state for toggle
  const currentMaterial = materials[currentMaterialIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => (prev >= 100 ? 0 : prev + 10))
    }, 500)
    return () => clearInterval(timer)
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
    setIsLoading(false)
  }

  async function markAsCompleted() {
    setIsLoading(true)
    try {
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
      })
      if (response.ok && currentMaterialIndex < materials.length - 1) {
        setCurrentMaterialIndex(currentMaterialIndex + 1)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderPDFViewer = () => (
    <Document
      file={currentMaterial.pdfUrl}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <Progress
            value={loadingProgress}
            className="w-48 mt-4"
          />
        </div>
      }
      className="flex flex-col items-center"
    >
      <Page
        pageNumber={pageNumber}
        width={Math.min(800, window.innerWidth - 64)}
        className="shadow-lg text-center items-center"
        renderTextLayer={showParsedText}  // Toggle text layer visibility
        renderAnnotationLayer={showParsedText}  // Toggle annotations visibility
      />
    </Document>
  )

  return (
    <div className="flex flex-col items-center space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentMaterial.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <span className="text-sm text-gray-600">Show parsed text</span>
                  <Switch
                    checked={showParsedText}
                    onCheckedChange={setShowParsedText}
                  />
                </div>
              </div>
              <Progress value={(pageNumber / (numPages || 1)) * 100} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMaterial.pdfUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 p-6 flex justify-center min-h-[600px]"
              >
                {renderPDFViewer()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 w-full max-w-md mx-auto"
      >
        <Button
          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1}
          variant="outline"
          className="flex-1 group transition-all duration-200 hover:scale-105"
        >
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Previous
        </Button>
        <span className="text-sm text-gray-600 font-medium">
          {pageNumber} / {numPages || "?"}
        </span>
        <Button
          onClick={() => setPageNumber(Math.min(numPages!, pageNumber + 1))}
          disabled={!numPages || pageNumber >= numPages}
          variant="outline"
          className="flex-1 group transition-all duration-200 hover:scale-105"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md mx-auto"
      >
        <Button
          className="w-full group relative overflow-hidden transition-all duration-200 hover:scale-105"
          onClick={markAsCompleted}
          disabled={
            isLoading || progress?.completedMaterials?.includes(currentMaterial.pdfUrl)
          }
          variant={
            progress?.completedMaterials?.includes(currentMaterial.pdfUrl)
              ? "outline"
              : "default"
          }
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : progress?.completedMaterials?.includes(currentMaterial.pdfUrl) ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Completed
            </>
          ) : (
            <>
              Mark as Completed
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity"
                initial={false}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
              />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}