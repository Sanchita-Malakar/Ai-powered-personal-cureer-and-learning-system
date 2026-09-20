"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DsaRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#dsa");
  }, [router]);

  return null;
}
