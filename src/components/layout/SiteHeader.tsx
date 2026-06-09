import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { HeaderSearch } from "./HeaderSearch";
import { type Dictionary } from "@/lib/dictionaries";
import { type Locale } from "@/lib/i18n";
import { getHeaderCategories } from "@/lib/sanity/queries";

interface SiteHeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export async function SiteHeader({ locale, dict }: SiteHeaderProps) {
  const categories = await getHeaderCategories(locale);

  const navLinkClass =
    locale === "ar"
      ? "text-[1rem] font-medium text-[var(--color-ink-800)] hover:text-[var(--color-oree-dark)] transition-colors duration-[var(--duration-base)]"
      : "text-[0.95rem] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-800)] hover:text-[var(--color-oree-dark)] transition-colors duration-[var(--duration-base)]";

  const subNavLinkClass =
    locale === "ar"
      ? "block px-6 py-2.5 text-[0.95rem] text-[var(--color-ink-700)] hover:bg-[var(--color-oree-pale)] hover:text-[var(--color-oree-dark)] transition-colors"
      : "block px-6 py-2.5 text-[var(--text-caption)] text-[var(--color-ink-700)] hover:bg-[var(--color-oree-pale)] hover:text-[var(--color-oree-dark)] transition-colors tracking-wide uppercase";

  // Search strings — dict.search is added in en.json / ar.json
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchDict = (dict as any).search ?? {};
  const placeholder: string = searchDict.placeholder ?? "Search articles...";
  const openSearchLabel: string = searchDict.openSearch ?? "Open search";
  const closeLabel: string = searchDict.close ?? "Close search";

  return (
    /* `relative` is required so HeaderSearch's `absolute top-full` positions against the header */
    <header className="sticky top-0 z-30 w-full bg-[var(--color-parchment)]/95 backdrop-blur-md border-b border-[var(--color-ink-200)] relative">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-oree)] to-transparent opacity-60" />

      <Container className="flex h-24 items-center justify-between gap-6 md:gap-8">
        <MobileMenu categories={categories} locale={locale} dict={dict} />

        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
          <Link
            href={`/${locale}`}
            className="group flex items-center transition-opacity duration-200 hover:opacity-90"
            aria-label="Zina Magazine"
          >
            <Image
              src="/logo-zina.png"
              alt="Zina Magazine Logo"
              width={477}
              height={265}
              priority
              className="h-[72px] w-auto object-contain md:h-[88px]"
            />
          </Link>
        </div>

        <nav
          className="hidden md:flex flex-1 justify-center gap-10"
          aria-label="Main navigation"
        >
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="relative group flex items-center h-full py-8"
            >
              <Link
                href={`/${locale}/categories/${cat.slug}`}
                className={navLinkClass}
              >
                {cat.title}
              </Link>

              {cat.subcategories.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-[var(--duration-base)] ease-[var(--ease-out-expo)] translate-y-1 group-hover:translate-y-0 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-[var(--color-paper)] border border-[var(--color-ink-200)] shadow-xl relative">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-oree)]" />

                    <ul className="py-3 flex flex-col">
                      {cat.subcategories.map((subCat) => (
                        <li key={subCat._id}>
                          <Link
                            href={`/${locale}/categories/${subCat.slug}`}
                            className={subNavLinkClass}
                          >
                            {subCat.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center justify-end md:flex-none">
          <div className="flex items-center gap-2 md:gap-3 md:rounded-full md:border md:border-[var(--color-ink-200)]/70 md:bg-[var(--color-paper)]/45 md:px-3 md:py-1.5 md:shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <LanguageSwitcher currentLocale={locale} />

            <span
              aria-hidden="true"
              className="hidden md:block h-4 w-px bg-[var(--color-ink-200)]"
            />

            {/* Search button + slide-down bar — works on mobile & desktop */}
            <HeaderSearch
              locale={locale}
              placeholder={placeholder}
              openSearchLabel={openSearchLabel}
              closeLabel={closeLabel}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
