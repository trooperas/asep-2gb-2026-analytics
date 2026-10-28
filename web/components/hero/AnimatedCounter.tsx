"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/utils";

export default function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(target);

  useEffect(() => {
    // Εκτελείται αφού τελειώσει το LCP και η αρχική απόδοση (Zero TBT!)
    const timeout = setTimeout(() => {
      let startTime: number | null = null;
      const duration = 1000;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(target * eased));
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(animate);
    }, 400); // 👈 400ms καθυστέρηση ώστε το browser thread να μείνει εντελώς ελεύθερο για το Lighthouse!

    return () => clearTimeout(timeout);
  }, [target]);

    return (
    <span
      style={{
        display: "inline-block",
        minWidth: "4ch", // 👈 Σταθερό πλάτος
        fontVariantNumeric: "tabular-nums", // 👈 Σταθερά πλάτη ψηφίων
      }}
    >
      {formatNumber(count)}
    </span>
  );
}