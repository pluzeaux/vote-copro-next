"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // À chaque changement de route, on remonte en haut
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
