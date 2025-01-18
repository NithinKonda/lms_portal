"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState([
    { title: "", pdfUrl: "", order: 0 },
  ]);

  const addMaterial = () => {
    setMaterials([
      ...materials,
      { title: "", pdfUrl: "", order: materials.length },
    ]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: string, value: string) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value,
    };
    setMaterials(updatedMaterials);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    });

    if (response.ok) {
      router.push("/courses");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Create New Course
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Course Materials
                </label>
                <Button type="button" onClick={addMaterial} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </div>

              <div className="space-y-4">
                {materials.map((material, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex-1 space-y-4">
                      <Input
                        placeholder="Material Title"
                        value={material.title}
                        onChange={(e) =>
                          updateMaterial(index, "title", e.target.value)
                        }
                        required
                      />
                      <Input
                        placeholder="PDF URL"
                        value={material.pdfUrl}
                        onChange={(e) =>
                          updateMaterial(index, "pdfUrl", e.target.value)
                        }
                        required
                      />
                    </div>
                    {materials.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeMaterial(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/courses")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Course</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}