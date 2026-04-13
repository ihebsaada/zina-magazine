import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu, type NavLink } from './MobileMenu'
import { type Dictionary } from '@/lib/dictionaries'
import { type Locale } from '@/lib/i18n'

interface SiteHeaderProps {
  locale: Locale
  dict: Dictionary
}

export function SiteHeader({ locale, dict }: SiteHeaderProps) {
  const navLinks: NavLink[] = [
    { href: `/${locale}/categories/culture`, label: dict.nav.culture },
    { href: `/${locale}/categories/arts`, label: dict.nav.arts },
    { href: `/${locale}/categories/society`, label: dict.nav.society },
    { href: `/${locale}/categories/travel`, label: dict.nav.travel },
    { href: `/${locale}/categories/fashion`, label: dict.nav.fashion },
  ]

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--color-ink-200)] bg-[var(--color-parchment)]/90 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        
        {/* Menu Mobile (visible uniquement < md) */}
        <MobileMenu links={navLinks} locale={locale} dict={dict} />

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
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions (Langue, Recherche...) — Aligné à droite (end) */}
        <div className="flex items-center justify-end md:flex-none">
          <LanguageSwitcher currentLocale={locale} />
        </div>

      </Container>
    </header>
  )
}
