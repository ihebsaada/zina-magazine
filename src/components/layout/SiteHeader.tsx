import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { type Dictionary } from "@/lib/dictionaries";
import { type Locale } from "@/lib/i18n";
import { getMainCategoriesWithSubs } from "@/lib/sanity/queries";

interface SiteHeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export async function SiteHeader({ locale, dict }: SiteHeaderProps) {
  const categories = await getMainCategoriesWithSubs(locale);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--color-ink-200)] bg-[var(--color-parchment)]/90 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        {/* Menu Mobile (visible uniquement < md) */}
        <MobileMenu categories={categories} locale={locale} dict={dict} />

        {/* Logo — centré sur mobile, aligné start sur desktop */}
        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
          <Link
            href={`/${locale}`}
            className="font-editorial text-3xl font-bold tracking-tight text-[var(--color-ink-950)] hover:text-[var(--color-oree-dark)] transition-colors"
          >
            Xmedia
          </Link>
        </div>

        {/* Navigation Desktop (cachée sur mobile) */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          {categories.map((cat) => (
            <div key={cat._id} className="relative group flex items-center h-full py-6">
              <Link href={`/${locale}/categories/${cat.slug}`} className="nav-link text-sm font-medium uppercase tracking-widest text-[var(--color-ink-800)] group-hover:text-[var(--color-oree)] transition-colors">
                {cat.title}
              </Link>
              
              {/* CSS Dropdown pour Desktop - UX Éditoriale */}
              {cat.subcategories.length > 0 && (
                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-[var(--ease-editorial)] transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-[var(--color-paper)] border border-[var(--color-ink-200)] shadow-2xl relative">
                    {/* Ligne d'accent supérieure */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--color-oree)]" />
                    
                    <ul className="py-3 flex flex-col">
                      {cat.subcategories.map((subCat) => (
                        <li key={subCat._id}>
                          <Link 
                            href={`/${locale}/categories/${subCat.slug}`}
                            className="block px-6 py-2.5 text-[0.9375rem] text-[var(--color-ink-700)] hover:bg-[var(--color-parchment)] hover:text-[var(--color-oree)] transition-colors"
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

        {/* Actions (Langue, Recherche...) — Aligné à droite (end) */}
        <div className="flex items-center justify-end md:flex-none">
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </Container>
    </header>
  );
}
