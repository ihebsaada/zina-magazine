import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { getDictionary } from '@/lib/dictionaries'
import {
  getAllCategorySlugs,
  getAllCategories,
  getArticlesByCategory,
} from '@/lib/sanity/queries'

import { Container } from '@/components/ui/Container'
import { ArticleCard } from '@/components/article/ArticleCard'

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return slugs.flatMap(slug => [
    { locale: 'en', slug },
    { locale: 'ar', slug },
  ])
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const categories = await getAllCategories(locale as Locale)
  const category = categories.find(c => c.slug === slug)
  
  if (!category) return {}
  
  return {
    title: `${category.title} | Xmedia Magazine`,
    description: category.description,
  }
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()

  const resolved = locale as Locale
  const dict = await getDictionary(resolved)

  // ── Récupération depuis Sanity ──────────────────────────
  const allCategories = await getAllCategories(resolved)
  const category = allCategories.find((c) => c.slug === slug)

  if (!category) notFound()

  const articles = await getArticlesByCategory(slug, resolved)

  return (
    <main className="flex-1 pb-32">
      
      {/* ── HEADER MAGISTRAL DE LA CATÉGORIE ──────────────────────────── */}
      <header className="pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[var(--color-ink-200)] bg-[var(--color-paper)] relative overflow-hidden">
        {/* Typographie décorative géante en arrière-plan */}
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <span className="font-editorial text-[15rem] leading-none whitespace-nowrap text-[var(--color-ink-950)] font-bold">
            {category.title}
          </span>
        </div>

        <Container className="relative z-10 text-center flex flex-col items-center">
          <span className="label-category mb-6">
            {resolved === 'ar' ? 'فئة' : 'Category'}
          </span>
          <h1 className="font-editorial text-[var(--text-display)] text-[var(--color-ink-950)] leading-tight">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-6 text-[var(--text-lead)] italic text-[var(--color-ink-600)] max-w-2xl">
              {category.description}
            </p>
          )}
          <p className="mt-4 text-[var(--text-caption)] text-[var(--color-ink-400)] tracking-widest uppercase font-medium">
            {articles.length} {resolved === 'ar' ? 'مقالات' : 'Articles'}
          </p>
        </Container>
      </header>

      {/* ── GRILLE D'ARTICLES ─────────────────────────────────────────── */}
      <section className="py-16">
        <Container>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {articles.map((article, index) => {
                const aspect = index % 3 === 0 ? 'portrait' : 'landscape'
                return (
                  <ArticleCard 
                    key={article._id} 
                    article={article} 
                    locale={resolved} 
                    dict={dict} 
                    aspectRatio={aspect}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-24 text-[var(--color-ink-500)] text-[var(--text-lead)] italic">
              {resolved === 'ar' 
                ? 'لا توجد مقالات في هذه الفئة بعد.' 
                : 'No articles in this category yet.'}
            </div>
          )}
        </Container>
      </section>

    </main>
  )
}
