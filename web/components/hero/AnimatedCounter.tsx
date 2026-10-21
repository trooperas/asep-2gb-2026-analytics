"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/utils";

export default function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(target); // Ξεκινάει απευθείας με τον αριθμό για να μην καθυστερεί το LCP!

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [target]);

  return <>{formatNumber(count)}</>;
}