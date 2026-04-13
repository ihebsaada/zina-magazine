import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { type Dictionary } from "@/lib/dictionaries";
import { type Locale } from "@/lib/i18n";

interface SiteFooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function SiteFooter({ locale, dict }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-[var(--color-ink-200)] bg-[var(--color-paper)] pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          {/* Section 1 : Branding & Tagline */}
          <div className="md:col-span-2 max-w-sm">
            <Link
              href={`/${locale}`}
              className="font-editorial text-3xl font-bold text-[var(--color-ink-950)] inline-block mb-4"
            >
              Xmedia
            </Link>
            <p className="text-[var(--text-lead)] italic text-[var(--color-ink-600)] leading-relaxed">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Section 2 : Editorial Nav */}
          <div>
            <h4 className="font-body text-[var(--text-caption)] font-bold uppercase tracking-widest text-[var(--color-ink-900)] mb-6">
              {dict.footer.sections.editorial}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${locale}/categories/culture`}
                  className="text-[var(--color-ink-600)] hover:text-[var(--color-oree)] transition-colors"
                >
                  {dict.nav.culture}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/categories/arts`}
                  className="text-[var(--color-ink-600)] hover:text-[var(--color-oree)] transition-colors"
                >
                  {dict.nav.arts}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/categories/society`}
                  className="text-[var(--color-ink-600)] hover:text-[var(--color-oree)] transition-colors"
                >
                  {dict.nav.society}
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3 : Corporate Nav */}
          <div>
            <h4 className="font-body text-[var(--text-caption)] font-bold uppercase tracking-widest text-[var(--color-ink-900)] mb-6">
              Xmedia
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-[var(--color-ink-600)] hover:text-[var(--color-ink-950)] transition-colors"
                >
                  {dict.footer.sections.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-[var(--color-ink-600)] hover:text-[var(--color-ink-950)] transition-colors"
                >
                  {dict.footer.sections.contact}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-[var(--color-ink-600)] hover:text-[var(--color-ink-950)] transition-colors"
                >
                  {dict.footer.sections.subscribe}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-ink-200)] flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-[var(--color-ink-500)]">
            {dict.footer.copyright}
          </p>
          <div className="flex gap-6 text-sm text-[var(--color-ink-500)]">
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-[var(--color-ink-900)] transition-colors"
            >
              {dict.footer.legal.privacy}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="hover:text-[var(--color-ink-900)] transition-colors"
            >
              {dict.footer.legal.terms}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
