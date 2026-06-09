"use client";

/**
 * components/ui/ScrollToTop.tsx
 *
 * Floating scroll-to-top button.
 * Appears after the user scrolls down 400px.
 * Elegant, non-intrusive, editorial.
 */

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
  className?: string;
}

export function ScrollToTop({ className }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        // Position: fixed bottom-right, safe area inset
        "fixed bottom-8 end-8 z-40",
        // Size & shape
        "w-11 h-11 flex items-center justify-center",
        // Style: parchment background, oree border, no border-radius (editorial)
        "bg-[var(--color-parchment)] border border-[var(--color-oree)]",
        "text-[var(--color-oree)] hover:bg-[var(--color-oree)] hover:text-[var(--color-parchment)]",
        // Transition
        "transition-all duration-[var(--duration-base)] ease-[var(--ease-out-expo)]",
        // Visibility animation
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
        className,
      )}
    >
      {/* Upward chevron — simple SVG, no external dependency */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="stroke-current"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5L8 5.5L13 10.5" />
      </svg>
    </button>
  );
}
