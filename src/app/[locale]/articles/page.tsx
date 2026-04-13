import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { getDictionary } from '@/lib/dictionaries'
import { Container } from '@/components/ui/Container'
import { FeaturedArticleCard } from '@/components/article/FeaturedArticleCard'
import { ArticleCard } from '@/components/article/ArticleCard'
import { getAllArticles } from '@/lib/sanity/queries'
export const metadata = {
  title: 'Editorial | Xmedia Magazine',
  description: 'Explore our latest cultural and design stories.',
}

export default async function ArticlesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const resolved = locale as Locale
  const dict = await getDictionary(resolved)

  let articles = []
  try {
    articles = await getAllArticles(resolved)
  } catch (error) {
    console.error('Sanity fetch failed:', error)
    throw error
  }

  if (articles.length === 0) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-editorial text-4xl">No articles found.</h1>
      </Container>
    )
  }

  const [featured, ...rest] = articles

  return (
    <main className="flex-1 pb-32">
      
      {/* ── HEADER DE LA PAGE ─────────────────────────────────────────── */}
      <section className="pt-16 pb-12 border-b border-[var(--color-ink-200)] bg-[var(--color-paper)]">
        <Container>
          <div className="max-w-2xl">
            <h1 className="font-editorial text-[var(--text-display)] text-[var(--color-ink-950)] leading-tight mb-4">
              {resolved === 'ar' ? 'الافتتاحيات' : 'Editorial'}
            </h1>
            <p className="text-[var(--text-lead)] italic text-[var(--color-ink-600)]">
              {resolved === 'ar' 
                ? 'استكشف أحدث القصص الثقافية والتصميمية وأسلوب الحياة.' 
                : 'Explore our latest stories on culture, design, and lifestyle.'}
            </p>
          </div>
        </Container>
      </section>

      {/* ── ARTICLE À LA UNE ──────────────────────────────────────────── */}
      <section className="py-16">
        <Container>
           <FeaturedArticleCard 
              article={featured} 
              locale={resolved} 
              dict={dict} 
           />
        </Container>
      </section>

      {/* ── GRILLE ÉDITORIALE ─────────────────────────────────────────── */}
      <section className="py-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-16">
            {rest.map((article, index) => {
              // Création d'une grille asymétrique :
              // Les deux premiers articles prennent 3 colonnes chacun (moitié/moitié) avec format paysage
              // Les suivants prennent 2 colonnes chacun avec un format portrait mode
              const isLarge = index < 2
              const colSpan = isLarge ? 'lg:col-span-3' : 'lg:col-span-2'
              const aspect = isLarge ? 'landscape' : 'portrait'

              return (
                <div key={article._id} className={colSpan}>
                  <ArticleCard 
                    article={article} 
                    locale={resolved} 
                    dict={dict} 
                    aspectRatio={aspect}
                  />
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── PAGINATION (Factice) ──────────────────────────────────────── */}
      <section className="pt-24 pb-8">
        <Container className="flex justify-center">
          <div className="flex items-center gap-4 text-[var(--text-caption)] font-medium text-[var(--color-ink-500)] tracking-widest uppercase">
             <span className="text-[var(--color-ink-900)] border-b border-[var(--color-ink-900)] pb-1">1</span>
             <span className="hover:text-[var(--color-ink-900)] transition-colors cursor-pointer pb-1">2</span>
             <span className="hover:text-[var(--color-ink-900)] transition-colors cursor-pointer pb-1">3</span>
             <span className="px-2">...</span>
             <span className="hover:text-[var(--color-ink-900)] transition-colors cursor-pointer pb-1">
               {resolved === 'ar' ? 'التالي' : 'Next'}
             </span>
          </div>
        </Container>
      </section>

    </main>
  )
}
