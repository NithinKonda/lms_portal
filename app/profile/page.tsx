"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



interface User {
  name:String,
  email:String,
  role:String
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch("/api/users/me");
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        setUser(userData);

        const coursesResponse = await fetch("/api/users/me/courses");
        if (!coursesResponse.ok) throw new Error("Failed to fetch courses");
        const coursesData = await coursesResponse.json();
        setEnrolledCourses(coursesData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
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
      </div>


      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">No of Enrolled Courses: {enrolledCourses.length}</h2>
        {enrolledCourses.length > 0 ? (
          <ul className="list-disc pl-6">
            {enrolledCourses.map((course, index) => (
              <li key={index} className="mb-2">
                <strong>Course ID:</strong> {course.courseId}

              </li>
            ))}
          </ul>
        ) : (
          <div>No courses enrolled</div>
        )}
      </div>
    </div>
  );
}
