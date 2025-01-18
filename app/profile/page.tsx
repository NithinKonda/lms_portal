// app/profile/page.tsx
"use client"; // Ensure this is a client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/users/me");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-semibold text-center mb-8">Your Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        <div className="mb-4">
          <strong>Name:</strong> {user.name || "N/A"}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="mb-4">
          <strong>Role:</strong> {user.role}
        </div>
        {/* Add any additional details you want to display */}
      </div>
    </div>
  );
}
