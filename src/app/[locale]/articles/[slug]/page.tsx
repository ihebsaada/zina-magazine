import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/dictionaries'
import { type Locale } from '@/lib/i18n'
import { getArticleBySlug, getArticlesByCategory, getAllArticleSlugs } from '@/lib/sanity/queries'
import { getComments, getLikeCount } from '@/lib/supabase/queries'

import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ArticleMeta } from '@/components/article/ArticleMeta'
import { ArticleBody } from '@/components/article/ArticleBody'
import { InteractionsUI } from '@/components/article/InteractionsUI'
import { ArticleCard } from '@/components/article/ArticleCard'

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params
  
  let article = null
  try {
    article = await getArticleBySlug(slug, locale as Locale)
  } catch (error) {
    console.error('Sanity fetch failed for metadata:', error)
    throw error
  }
  
  if (!article) return {}
  
  return {
    title: `${article.title} | Xmedia Magazine`,
    description: article.excerpt,
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs()
    return slugs.flatMap((slug) => [
      { locale: 'en', slug },
      { locale: 'ar', slug },
    ])
  } catch {
    return []
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const resolved = locale as Locale
  const dict = await getDictionary(resolved)

  let article: Awaited<ReturnType<typeof getArticleBySlug>> = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let relatedArticles: any[] = []
  
  let initialComments: any[] = []
  let initialLikeCount = 0

  try {
    article = await getArticleBySlug(slug, resolved)
    if (article) {
      // Pour une performance maximale, on parallélise Sanity et Supabase !
      const [related, comments, likes] = await Promise.all([
        getArticlesByCategory(article.category.slug, resolved),
        getComments(article._id),
        getLikeCount(article._id),
      ])
      
      initialComments = comments
      initialLikeCount = likes

      relatedArticles = related
        .filter(a => a._id !== article?._id)
        .slice(0, 3)
    }
  } catch (error) {
    console.error('Sanity fetch failed:', error)
    throw error
  }

  if (!article) {
    notFound()
  }

  return (
    <main className="flex-1 pb-32">
      
      {/* ── HEADER DE L'ARTICLE ───────────────────────────────────────── */}
      <header className="pt-16 pb-12 lg:pt-24 lg:pb-16 bg-[var(--color-paper)] border-b border-[var(--color-ink-200)]">
        <Container variant="prose" className="text-center flex flex-col items-center">
          
          <Link href={`/${resolved}/categories/${article.category.slug}`}>
            <Badge variant="oree" className="mb-8">
              {article.category.title}
            </Badge>
          </Link>

          <h1 className="font-editorial text-[var(--text-display)] text-[var(--color-ink-950)] leading-tight mb-8 max-w-4xl text-balance">
            {article.title}
          </h1>

          <p className="text-xl md:text-2xl text-[var(--color-ink-700)] italic leading-relaxed mb-10 max-w-3xl text-balance">
            {article.excerpt}
          </p>

          <ArticleMeta 
            author={article.author}
            publishedAt={article.publishedAt}
            readingTime={article.readingTime}
            locale={resolved}
            dict={dict}
            className="justify-center"
          />

        </Container>
      </header>

      {/* ── IMAGE DE COUVERTURE ───────────────────────────────────────── */}
      <div className="w-full max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-12 -mt-8 sm:-mt-12 relative z-10">
        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-[var(--color-ink-100)] shadow-2xl shadow-[var(--color-ink-950)]/5">
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* ── CORPS DE L'ARTICLE ────────────────────────────────────────── */}
      <article className="py-16 md:py-24">
        <Container variant="prose">
          
          <ArticleBody body={article.body} />

          {/* Séparateur de fin d'article */}
          <div className="mt-16 mb-12 flex justify-center">
             <div className="w-16 h-[1px] bg-[var(--color-oree)]" />
          </div>

          <InteractionsUI 
            articleId={article._id}
            locale={resolved}
            dict={dict}
            initialComments={initialComments}
            initialLikeCount={initialLikeCount}
          />

          <div className="mt-16 p-8 bg-[var(--color-paper-alt)] flex items-center gap-6">
            {article.author.avatar && (
              <Image 
                src={article.author.avatar}
                alt={article.author.name}
                width={80}
                height={80}
                className="rounded-full object-cover shrink-0"
              />
            )}
            <div>
              <h4 className="font-editorial text-2xl text-[var(--color-ink-950)] mb-2">
                {article.author.name}
              </h4>
              <p className="text-[var(--text-body)] text-[var(--color-ink-600)] leading-relaxed">
                {article.author.bio}
              </p>
            </div>
          </div>

        </Container>
      </article>

      {/* ── ARTICLES RELATIFS ─────────────────────────────────────────── */}
      {relatedArticles.length > 0 && (
        <section className="py-24 bg-[var(--color-paper)] border-t border-[var(--color-ink-200)]">
          <Container>
            <SectionHeader 
               title={resolved === 'ar' ? 'اقرأ أيضاً' : 'Read Next'}
               action={<Link href={`/${resolved}/categories/${article.category.slug}`} className="nav-link">{resolved === 'ar' ? 'المزيد' : 'See all'}</Link>}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map(rel => (
                <ArticleCard 
                  key={rel._id} 
                  article={rel} 
                  locale={resolved} 
                  dict={dict} 
                  aspectRatio="landscape"
                />
              ))}
            </div>
          </Container>
        </section>
      )}

    </main>
  )
}
