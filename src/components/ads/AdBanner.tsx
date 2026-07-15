"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { ResolvedAd } from "@/lib/sanity/queries";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdBannerProps {
  locale: Locale;
  ads: ResolvedAd[];
}

export function AdBanner({ locale, ads }: AdBannerProps) {
  const [index, setIndex] = useState(0);

  const isArabic = locale === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [ads.length]);

  const copy = useMemo(
    () => ({
      sectionLabel: isArabic ? "محتوى مختار" : "Curated Feature",
      sponsored: isArabic ? "محتوى برعاية" : "Sponsored",
      cta: isArabic ? "اكتشفي المزيد" : "Discover More",
      previous: isArabic ? "الإعلان السابق" : "Previous advertisement",
      next: isArabic ? "الإعلان التالي" : "Next advertisement",
      goTo: isArabic ? "الانتقال إلى الإعلان" : "Go to advertisement",
    }),
    [isArabic],
  );

  if (ads.length === 0) return null;

  const currentAd = ads[index];

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % ads.length);
  };

  return (
    <section
      dir={dir}
      className="relative w-full overflow-hidden border-y border-[var(--color-ink-200)] bg-[var(--color-paper)]"
      aria-label={isArabic ? "بانر دعائي" : "Advertising banner"}
    >
      <div className="relative aspect-[16/7] min-h-[280px] w-full sm:min-h-[320px] lg:min-h-[420px]">
        <Image
          src={currentAd.image}
          alt={currentAd.title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-[1600ms] ease-out scale-[1.02]"
        />

        {/* overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,16,12,0.78),rgba(20,16,12,0.36),rgba(20,16,12,0.08))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,16,12,0.34),transparent_45%)]" />

        {/* content */}
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="w-full px-6 py-8 sm:px-8 md:px-12 lg:px-16">
            <div className="max-w-2xl">
              <h3 className="font-editorial text-white text-3xl sm:text-4xl lg:text-5xl">
                {currentAd.title}
              </h3>

              <p className="mt-3 text-white/80">
                {currentAd.description}
              </p>
            </div>
          </div>
        </div>

        {/* Full-slide click-through link — placed after image/gradients/content so it
            sits above them (DOM order), and before the nav buttons so those stay on top. */}
        {currentAd.link && (
          <a
            href={currentAd.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
            aria-label={currentAd.title}
          />
        )}

        {/* LEFT BUTTON = PREVIOUS */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 flex items-center",
            isArabic ? "right-0 pr-4" : "left-0 pl-4",
          )}
        >
          <button
            type="button"
            onClick={prevSlide}
            aria-label={copy.previous}
            className="pointer-events-auto hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-[var(--color-ink-950)] md:flex"
          >
            {isArabic ? (
              <ChevronRight size={20} strokeWidth={1.5} />
            ) : (
              <ChevronLeft size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* RIGHT BUTTON = NEXT */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 flex items-center",
            isArabic ? "left-0 pl-4" : "right-0 pr-4",
          )}
        >
          <button
            type="button"
            onClick={nextSlide}
            aria-label={copy.next}
            className="pointer-events-auto hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-[var(--color-ink-950)] md:flex"
          >
            {isArabic ? (
              <ChevronLeft size={20} strokeWidth={1.5} />
            ) : (
              <ChevronRight size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
