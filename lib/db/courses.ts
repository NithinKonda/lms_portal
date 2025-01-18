import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface Course {
  _id?: string;
  title: string;
  description: string;
  materials: {
    title: string;
    pdfUrl: string;
    order: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedMaterials: string[];
  lastAccessedAt: Date;
  completedAt?: Date;
}

export async function createCourse(course: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('courses').insertOne({
    ...course,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return result;
}

export async function getCourses() {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('courses').find().toArray();
}

export async function getCourse(id: string) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('courses').findOne({ _id: new ObjectId(id) });
}

export async function updateCourseProgress(progress: CourseProgress) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('courseProgress').updateOne(
    { userId: progress.userId, courseId: progress.courseId },
    { $set: progress },
    { upsert: true }
  );
  
  return result;
}

export async function getCourseProgress(userId: string, courseId: string) {
  const client = await clientPromise;
  const db = client.db();
  
  return await db.collection('courseProgress').findOne({
    userId,
    courseId
  });
}