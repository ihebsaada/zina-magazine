import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { getAllCategoriesWithCount } from '@/lib/sanity/queries'
import { Container } from '@/components/ui/Container'

export const metadata = {
  title: 'Categories | Xmedia Magazine',
  description: 'Explore topics and categories.',
}

export default async function CategoriesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const resolved = locale as Locale

  // ── Récupération Optimisée depuis Sanity (1 seule requête O(1)) ──
  const categories = await getAllCategoriesWithCount(resolved)

  return (
    <main className="flex-1 pb-32">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-12 border-b border-[var(--color-ink-200)] bg-[var(--color-paper)]">
        <Container>
          <div className="max-w-2xl">
            <h1 className="font-editorial text-[var(--text-display)] text-[var(--color-ink-950)] leading-tight mb-4">
              {resolved === 'ar' ? 'الفئات' : 'Categories'}
            </h1>
            <p className="text-[var(--text-lead)] italic text-[var(--color-ink-600)]">
              {resolved === 'ar' 
                ? 'تصفح المجلة حسب الموضوع.' 
                : 'Browse the magazine by topic.'}
            </p>
          </div>
        </Container>
      </section>

      {/* ── GRILLE DE CATÉGORIES ──────────────────────────────────────── */}
      <section className="py-16">
        <Container>
          {categories.length === 0 ? (
            <p className="text-center py-24 text-[var(--color-ink-500)] italic">
              {resolved === 'ar' ? 'لا توجد فئات بعد.' : 'No categories yet.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => {
                const count = category.articleCount
                return (
                  <Link 
                    key={category._id} 
                    href={`/${resolved}/categories/${category.slug}`}
                    className="group relative flex flex-col items-center justify-center p-12 aspect-square border border-[var(--color-ink-200)] bg-[var(--color-paper-alt)] hover:border-[var(--color-oree)] hover:bg-[var(--color-parchment)] transition-all duration-[var(--duration-base)]"
                  >
                    <h2 className="font-editorial text-3xl font-bold text-[var(--color-ink-950)] group-hover:text-[var(--color-oree)] transition-colors mb-4 text-center">
                      {category.title}
                    </h2>
                    <span className="font-body text-[var(--text-caption)] font-medium text-[var(--color-ink-500)] tracking-widest uppercase">
                      {count} {resolved === 'ar' ? 'مقالات' : 'Articles'}
                    </span>
                    
                    {/* Effet décoratif au hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-oree)] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500 ease-[var(--ease-editorial)]" />
                  </Link>
                )
              })}
            </div>
          )}
        </Container>
      </section>

    </main>
  )
}
