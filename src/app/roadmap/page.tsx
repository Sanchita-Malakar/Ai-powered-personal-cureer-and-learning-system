"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoadmapRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#roadmap");
  }, [router]);

  return null;
}
