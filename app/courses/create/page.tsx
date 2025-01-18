'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X, ArrowLeft, FileText, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export default function CreateCoursePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [materials, setMaterials] = useState([
    { title: "", pdfUrl: "", order: 0 },
  ])

  const progress = Math.min(
    ((title ? 1 : 0) + (description ? 1 : 0) + 
    materials.filter(m => m.title && m.pdfUrl).length / materials.length) / 3 * 100,
    100
  )

  const addMaterial = () => {
    setMaterials([
      ...materials,
      { title: "", pdfUrl: "", order: materials.length },
    ])
  }

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index))
  }

  const updateMaterial = (index: number, field: string, value: string) => {
    const updatedMaterials = [...materials]
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value,
    }
    setMaterials(updatedMaterials)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          materials,
        }),
      })

      if (response.ok) {
        router.push("/courses")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <main className="container mx-auto px-4 py-16">
        <Button
          variant="ghost"
          className="mb-8 hover:translate-x-1 transition-transform"
          onClick={() => router.push("/courses")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <Card className="max-w-4xl mx-auto backdrop-blur-sm bg-white/80">
          <CardContent className="p-6">
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Create New Course
            </motion.h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.01]"
                  placeholder="Enter course title..."
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[120px] transition-all duration-200 focus:scale-[1.01]"
                  placeholder="Describe your course..."
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Course Materials
                  </label>
                  <Button 
                    type="button" 
                    onClick={addMaterial} 
                    variant="outline"
                    className="hover:scale-105 transition-transform"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {materials.map((material, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8 }}
                      >
                        <Card className="group hover:shadow-md transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex gap-4 items-start">
                              <div className="flex-none">
                                <FileText className="h-6 w-6 text-gray-400 group-hover:text-purple-500 transition-colors" />
                              </div>
                              <div className="flex-1 space-y-4">
                                <Input
                                  placeholder="Material Title"
                                  value={material.title}
                                  onChange={(e) =>
                                    updateMaterial(index, "title", e.target.value)
                                  }
                                  required
                                  className="transition-all duration-200 focus:scale-[1.01]"
                                />
                                <Input
                                  placeholder="PDF URL"
                                  value={material.pdfUrl}
                                  onChange={(e) =>
                                    updateMaterial(index, "pdfUrl", e.target.value)
                                  }
                                  required
                                  className="transition-all duration-200 focus:scale-[1.01]"
                                />
                              </div>
                              {materials.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => removeMaterial(index)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-end gap-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/courses")}
                  className="hover:scale-105 transition-transform"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white hover:scale-105 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

