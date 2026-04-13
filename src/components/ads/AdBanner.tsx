"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ads = [
  {
    id: "ad-1",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=2000&q=80",
    title: "Timeless Craftsmanship",
    description: "Discover precision and elegance in every detail.",
  },
  {
    id: "ad-2",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80",
    title: "Modern Fashion",
    description: "Where minimalism meets bold expression.",
  },
  {
    id: "ad-3",
    image:
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=2000&q=80",
    title: "Architectural Vision",
    description: "Spaces that redefine contemporary living.",
  },
];

export function AdBanner() {
  const [index, setIndex] = useState(0);

  // autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goTo = (i: number) => setIndex(i);

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Image */}
      <div className="relative w-full aspect-[16/5] bg-[var(--color-ink-100)]">
        <Image
          src={ads[index].image}
          alt={ads[index].title}
          fill
          className="object-cover transition-opacity duration-700 ease-in-out"
          priority
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="px-6 lg:px-16 max-w-xl text-white">
          <h3 className="font-editorial text-2xl lg:text-4xl leading-tight mb-3">
            {ads[index].title}
          </h3>

          <p className="text-sm lg:text-base text-white/80 leading-relaxed">
            {ads[index].description}
          </p>
        </div>
      </div>

      {/* Controls (hover only) */}
      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() =>
            setIndex((prev) => (prev - 1 + ads.length) % ads.length)
          }
          className="bg-black/40 hover:bg-black/60 text-white px-3 py-2"
        >
          ‹
        </button>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % ads.length)}
          className="bg-black/40 hover:bg-black/60 text-white px-3 py-2"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {ads.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              i === index ? "bg-white w-6" : "bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}
