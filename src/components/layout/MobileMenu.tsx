"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionaries";
import type { ResolvedCategory } from "@/lib/sanity/queries";

interface MobileMenuProps {
  categories: ResolvedCategory[];
  locale: string;
  dict: Dictionary;
}

export function MobileMenu({ categories, locale, dict }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isRTL = locale === "ar";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const aboutLabel =
    dict.footer?.sections?.about ?? (isRTL ? "من نحن" : "About");
  const contactLabel =
    dict.footer?.sections?.contact ?? (isRTL ? "اتصل بنا" : "Contact");

  const drawer = (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[9998] bg-black/30 backdrop-blur-[2px] transition-opacity duration-500 ease-[var(--ease-editorial)]",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        dir={isRTL ? "rtl" : "ltr"}
        className={cn(
          "fixed top-0 bottom-0 z-[9999] flex w-[94vw] max-w-[390px] flex-col bg-[var(--color-parchment)] shadow-2xl",
          "transition-transform duration-500 ease-[var(--ease-editorial)]",
          isRTL ? "right-0" : "left-0",
          isOpen
            ? "translate-x-0"
            : isRTL
              ? "translate-x-full"
              : "-translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex h-[104px] items-center justify-between px-7 border-b border-[var(--color-ink-200)]/60">
          <Link
            href={`/${locale}`}
            onClick={() => setIsOpen(false)}
            className="group flex items-center transition-opacity duration-200 hover:opacity-90"
            aria-label="Zina Magazine"
          >
            <Image
              src="/logo-zina.png"
              alt="Zina Magazine Logo"
              width={477}
              height={265}
              className="h-[56px] w-auto object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-[var(--color-ink-500)] hover:text-[var(--color-ink-950)] transition-colors duration-[var(--duration-base)] focus:outline-none"
            aria-label="Close menu"
          >
            <X strokeWidth={1.25} className="h-6 w-6" />
          </button>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-oree)] to-transparent opacity-40" />

        <nav className="flex-1 overflow-y-auto px-7 pt-8 pb-7">
          <div className="flex flex-col">
            {categories.map((mainCat) => {
              const isActive = pathname.includes(
                `/${locale}/categories/${mainCat.slug}`,
              );

              return (
                <div
                  key={mainCat._id}
                  className="border-b border-[var(--color-ink-200)]/60 last:border-b-0 py-1.5"
                >
                  <Link
                    href={`/${locale}/categories/${mainCat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex w-full items-center justify-between py-4 transition-colors duration-[var(--duration-base)]",
                      isRTL
                        ? "text-[1.1rem] font-medium"
                        : "text-[0.875rem] font-medium uppercase tracking-[0.12em]",
                      isActive
                        ? "text-[var(--color-oree-dark)] font-semibold"
                        : "text-[var(--color-ink-800)] hover:text-[var(--color-oree-dark)]",
                    )}
                  >
                    <span>{mainCat.title}</span>
                  </Link>

                  {mainCat.subcategories.length > 0 && (
                    <ul
                      className={cn(
                        "flex flex-col gap-2.5 pb-4 pt-0.5",
                        isRTL ? "border-r-2 pr-4" : "border-l-2 pl-4",
                        "border-[var(--color-oree-pale)]",
                      )}
                    >
                      {mainCat.subcategories.map((subCat) => {
                        const isSubActive = pathname.includes(
                          `/${locale}/categories/${subCat.slug}`,
                        );

                        return (
                          <li key={subCat._id}>
                            <Link
                              href={`/${locale}/categories/${subCat.slug}`}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "block w-full py-1.5 text-[0.875rem] transition-colors duration-[var(--duration-base)]",
                                !isRTL &&
                                  "text-[0.775rem] uppercase tracking-wider",
                                isSubActive
                                  ? "text-[var(--color-oree-dark)] font-semibold"
                                  : "text-[var(--color-ink-500)] hover:text-[var(--color-oree-dark)]",
                              )}
                            >
                              {subCat.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 border-t border-[var(--color-ink-200)]/60 pt-6 pb-2">
            <div className="flex items-center gap-6">
              <Link
                href={`/${locale}/about`}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-[var(--color-ink-500)] hover:text-[var(--color-oree-dark)] transition-colors duration-[var(--duration-base)]",
                  isRTL
                    ? "text-[0.95rem]"
                    : "text-[0.8rem] uppercase tracking-wider font-medium",
                )}
              >
                {aboutLabel}
              </Link>

              <span className="h-1 w-1 rounded-full bg-[var(--color-ink-300)]" />

              <Link
                href={`/${locale}/contact`}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-[var(--color-ink-500)] hover:text-[var(--color-oree-dark)] transition-colors duration-[var(--duration-base)]",
                  isRTL
                    ? "text-[0.95rem]"
                    : "text-[0.8rem] uppercase tracking-wider font-medium",
                )}
              >
                {contactLabel}
              </Link>
            </div>

            <p className="mt-4 font-sans text-[10px] leading-relaxed text-[var(--color-ink-400)]">
              &copy; {new Date().getFullYear()} ZINA.{" "}
              {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
          </div>
        </nav>
      </aside>
    </>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 -me-2 text-[var(--color-ink-900)] hover:text-[var(--color-oree)] transition-colors duration-[var(--duration-base)] focus:outline-none"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu strokeWidth={1.25} className="h-6 w-6" />
      </button>

      {mounted ? createPortal(drawer, document.body) : null}
    </div>
  );
}
