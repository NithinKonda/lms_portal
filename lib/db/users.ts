import clientPromise from "@/lib/mongodb";

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

export async function updateUserRole(userId: string, role: string) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection("users").updateOne(
    { _id: userId },
    { $set: { role } }
  );
}