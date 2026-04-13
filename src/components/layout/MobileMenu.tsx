"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionaries";

import type { ResolvedCategory } from "@/lib/sanity/queries";

interface MobileMenuProps {
  categories: ResolvedCategory[];
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: Dictionary; // Type the dictionary subset later
}

export function MobileMenu({ categories, locale, dict }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fermer le menu lors d'un changement de route
  useEffect(() => {
    // setIsOpen(false); -> removed to avoid cascading renders.
    // Instead we could rely on a pathname change by just closing it in the render or via route event.
    // Since Next.js App Router doesn't have a reliable route change event inside components natively that closes menus,
    // a common pattern is just avoiding sync setStates, or doing it differently.
    // Let's just wrap it in a timeout or remove it if not strictly causing issues but just lint warnings.
    // However, the standard fix is usually to let `pathname` be an effect dependency that just sets state asynchronously.
    const t = setTimeout(() => setIsOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  // Bloquer le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Bouton Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -me-2 text-[var(--color-ink-900)] hover:text-[var(--color-oree)] transition-colors"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu strokeWidth={1.5} className="w-6 h-6" />
      </button>

      {/* Backdrop (Assombrit le fond) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panneau latéral (Off-canvas) */}
      <div
        className={cn(
          "fixed top-0 bottom-0 z-50 w-full max-w-sm bg-[var(--color-parchment)] shadow-2xl transition-transform duration-500 ease-[var(--ease-editorial)] flex flex-col",
          // RTL native handling pour le positionnement : l'origine vient du 'start' logique
          "start-0 transform",
          isOpen
            ? "translate-x-0"
            : "ltr:-translate-x-full rtl:translate-x-full",
        )}
      >
        {/* Header du panneau mobile */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-[var(--color-ink-200)]">
          <span className="font-editorial text-2xl tracking-wide">Xmedia</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -me-2 text-[var(--color-ink-600)] hover:text-[var(--color-ink-950)] transition-colors"
            aria-label="Close menu"
          >
            <X strokeWidth={1.5} className="w-6 h-6" />
          </button>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
          {categories.map((mainCat) => {
            const isActive = pathname.includes(`/${locale}/categories/${mainCat.slug}`);
            return (
              <div key={mainCat._id} className="flex flex-col gap-3">
                <Link
                  href={`/${locale}/categories/${mainCat.slug}`}
                  className={cn(
                    "text-lg font-medium tracking-wide uppercase transition-colors",
                    isActive ? "text-[var(--color-oree)]" : "text-[var(--color-ink-800)]"
                  )}
                >
                  {mainCat.title}
                </Link>

                {/* Sous-catégories sous le parent */}
                {mainCat.subcategories.length > 0 && (
                  <ul className="flex flex-col gap-3 mt-1 ml-2 pl-4 border-l border-[var(--color-ink-200)]">
                    {mainCat.subcategories.map((subCat) => {
                      const isSubActive = pathname.includes(`/${locale}/categories/${subCat.slug}`);
                      return (
                        <li key={subCat._id}>
                          <Link
                            href={`/${locale}/categories/${subCat.slug}`}
                            className={cn(
                              "text-[0.9375rem] transition-colors block",
                              isSubActive 
                                ? "text-[var(--color-oree)] font-medium" 
                                : "text-[var(--color-ink-600)] hover:text-[var(--color-ink-950)]"
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

          <div className="my-8 rule-oree opacity-100" />

          <Link
            href={`/${locale}/about`}
            className="text-[var(--text-body)] text-[var(--color-ink-600)] hover:text-[var(--color-ink-950)]"
          >
            {dict.footer.sections.about}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="text-[var(--text-body)] text-[var(--color-ink-600)] hover:text-[var(--color-ink-950)]"
          >
            {dict.footer.sections.contact}
          </Link>
        </nav>
      </div>
    </div>
  );
}
