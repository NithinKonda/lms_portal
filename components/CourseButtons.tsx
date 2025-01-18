"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    <Button variant="outline" className="w-full" onClick={handleClick}>
      {label}
    </Button>
  );
}
