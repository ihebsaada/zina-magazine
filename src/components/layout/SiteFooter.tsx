import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { type Dictionary } from "@/lib/dictionaries";
import { type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getFooterSettings } from "@/lib/sanity/queries";

interface SiteFooterProps {
  locale: Locale;
  dict: Dictionary;
}

export async function SiteFooter({ locale, dict }: SiteFooterProps) {
  const { categories: footerCategories } = await getFooterSettings(locale);

  const isArabic = locale === "ar";

  const sectionTitleClass = cn(
    "mb-6 text-[var(--color-ink-900)]",
    isArabic
      ? "font-body text-sm font-semibold"
      : "font-body text-[var(--text-caption)] font-bold uppercase tracking-[0.16em]",
  );

  const footerLinkClass =
    "text-[var(--color-ink-600)] transition-colors duration-[var(--duration-base)] hover:text-[var(--color-oree-dark)]";

  return (
    <footer className="mt-auto border-t border-[var(--color-ink-200)] bg-[var(--color-paper)] pt-20 pb-8">
      <Container>
        <div className="grid grid-cols-1 gap-14 md:grid-cols-4 lg:gap-10">
          {/* Brand block */}
          <div className="md:col-span-2 max-w-md">
            <Link
              href={`/${locale}`}
              className="inline-block mb-5 transition-opacity duration-200 hover:opacity-90"
              aria-label="Zina Magazine"
            >
              <Image
                src="/logo-zina.png"
                alt="Zina Magazine Logo"
                width={140}
                height={42}
                className="h-[56px] w-auto object-contain"
              />
            </Link>

            <p
              className={cn(
                "max-w-sm leading-relaxed text-[var(--color-ink-600)]",
                isArabic ? "text-[1rem]" : "text-[var(--text-lead)] italic",
              )}
            >
              {dict.footer.tagline}
            </p>
          </div>

          {/* Editorial */}
          <div>
            <h4 className={sectionTitleClass}>
              {dict.footer.sections.editorial}
            </h4>

            <ul className="space-y-4">
              {footerCategories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/${locale}/categories/${cat.slug}`}
                    className={footerLinkClass}
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand / company */}
          <div>
            <h4 className={sectionTitleClass}>Zina</h4>

            <ul className="space-y-4">
              <li>
                <Link href={`/${locale}/about`} className={footerLinkClass}>
                  {dict.footer.sections.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className={footerLinkClass}>
                  {dict.footer.sections.contact}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#newsletter`}
                  className={footerLinkClass}
                >
                  {dict.footer.sections.subscribe}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--color-ink-200)] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-[var(--color-ink-500)]">
              {dict.footer.copyright}
            </p>

            <div className="flex items-center gap-6 text-sm text-[var(--color-ink-500)]">
              <Link
                href={`/${locale}/privacy`}
                className="transition-colors duration-[var(--duration-base)] hover:text-[var(--color-ink-900)]"
              >
                {dict.footer.legal.privacy}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="transition-colors duration-[var(--duration-base)] hover:text-[var(--color-ink-900)]"
              >
                {dict.footer.legal.terms}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
