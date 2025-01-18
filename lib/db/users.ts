import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface User {
  _id: string;
  email: string;
  role: string;
  name?: string;
  image?: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedMaterials: string[];
  lastAccessedAt: Date;
  completedAt?: Date;
}

export async function getUserCount() {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection("users").countDocuments();
}

export async function getUser(id: string) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection("users").findOne({ _id: id });
}

export async function getAllUsers() {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection("users").find().toArray();
}

export async function getUserProgress(userId: string) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection("courseProgress")
    .find({ userId })
    .toArray();
}

export async function updateUserRole(userId: string, role: string) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection("users").updateOne(
    { _id: userId },
    { $set: { role } }
  );
}