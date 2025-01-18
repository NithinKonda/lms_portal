"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CourseButtonsProps {
  route: string;
  label: string;
}

export default function CourseButtons({ route, label }: CourseButtonsProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <Link
      href={route}
      className="inline-block bg-white text-indigo-600 font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:bg-indigo-600 hover:text-white transform hover:-translate-y-1 hover:shadow-lg"
    >
      {label}
    </Link>
  );
}
