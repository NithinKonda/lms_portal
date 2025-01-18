import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface Team {
  _id?: string;
  name: string;
  description: string;
  createdBy: string;
  members: {
    userId: string;
    email: string;
    role: string;
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export async function createTeam(team: Omit<Team, '_id' | 'createdAt' | 'updatedAt'>) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('teams').insertOne({
    ...team,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return result;
}

export async function getTeams() {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('teams').find().toArray();
}

export async function getTeam(id: string) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('teams').findOne({ _id: new ObjectId(id) });
}

export async function updateTeam(id: string, update: Partial<Team>) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('teams').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...update,
        updatedAt: new Date()
      }
    }
  );
  
  return result;
}

export async function getTeamsByUserId(userId: string) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('teams').find({
    'members.userId': userId
  }).toArray();
}

export async function getAllUsers() {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('users').find({}, {
    projection: {
      email: 1,
      role: 1
    }
  }).toArray();
}