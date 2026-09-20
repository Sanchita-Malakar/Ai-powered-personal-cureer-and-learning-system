"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResumeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#resume");
  }, [router]);

  return null;
}
