"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdBannerProps {
  locale: Locale;
}

const ads = [
  {
    id: "ad-1",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=2000&q=80",
    title: {
      en: "Timeless Craftsmanship",
      ar: "حرفية خالدة",
    },
    description: {
      en: "Discover precision and elegance in every detail.",
      ar: "اكتشفي الدقة والأناقة في كل تفصيلة.",
    },
  },
  {
    id: "ad-2",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80",
    title: {
      en: "Modern Fashion",
      ar: "موضة عصرية",
    },
    description: {
      en: "Where minimalism meets bold expression.",
      ar: "حيث تلتقي البساطة مع التعبير الجريء.",
    },
  },
  {
    id: "ad-3",
    image:
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=2000&q=80",
    title: {
      en: "Architectural Vision",
      ar: "رؤية معمارية",
    },
    description: {
      en: "Spaces that redefine contemporary living.",
      ar: "مساحات تعيد تعريف أسلوب الحياة المعاصر.",
    },
  },
] as const;

export function AdBanner({ locale }: AdBannerProps) {
  const [index, setIndex] = useState(0);

  const isArabic = locale === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

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
          alt={currentAd.title[locale]}
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
                {currentAd.title[locale]}
              </h3>

              <p className="mt-3 text-white/80">
                {currentAd.description[locale]}
              </p>
            </div>
          </div>
        </div>

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