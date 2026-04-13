"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  // Bascule entre 'en' et 'ar'
  const targetLocale: Locale = currentLocale === "en" ? "ar" : "en";
  const targetLabel = currentLocale === "en" ? "العربية" : "EN";

  // Reconstruction de l'URL avec la nouvelle locale
  const getTargetUrl = () => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split("/");
    // Le premier segment est vide (avant le premier /), le deuxième est la locale actuelle
    if (segments[1] === currentLocale) {
      segments[1] = targetLocale;
      return segments.join("/");
    }
    return `/${targetLocale}${pathname}`;
  };

  return (
    <Link
      href={getTargetUrl()}
      className="inline-flex items-center gap-2 leading-none text-[var(--text-caption)] font-medium uppercase tracking-wider text-[var(--color-ink-600)] hover:text-[var(--color-ink-950)] transition-colors duration-[var(--duration-fast)]"
      prefetch={false} // Eviter le préchargement croisé des locales
      aria-label={`Switch language to ${targetLabel}`}
    >
      <Globe
        className="w-4 h-4 shrink-0 translate-y-[-2px]"
        strokeWidth={1.5}
      />
      <span
        className={
          targetLocale === "ar"
            ? "font-arabic font-normal leading-none"
            : "leading-none"
        }
      >
        {targetLabel}
      </span>
    </Link>
  );
}
