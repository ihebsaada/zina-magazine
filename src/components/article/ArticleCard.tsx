import Image from 'next/image'
import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import type { ArticleCard as ArticleCardType } from '@/types/magazine'
import { ArticleMeta } from './ArticleMeta'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: ArticleCardType
  locale: Locale
  dict: any
  className?: string
  /** 
   * Ratio de l'image. 'portrait' (4:5) très mode/édito. 
   * 'landscape' (3:2) plus standard. 'square' (1:1). 
   */
  aspectRatio?: 'portrait' | 'landscape' | 'square'
}

const aspectClasses = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[3/2]',
  square: 'aspect-square',
}

export function ArticleCard({ article, locale, dict, className, aspectRatio = 'portrait' }: ArticleCardProps) {
  return (
    <article className={cn('group flex flex-col', className)}>
      
      {/* ── Image ──────────────────────────────────────────────────────── */}
      <Link 
        href={`/${locale}/articles/${article.slug}`}
        className={cn('block w-full overflow-hidden bg-[var(--color-ink-100)] relative mb-6', aspectClasses[aspectRatio])}
      >
        <Image
          src={article.coverImage}
          alt={article.coverImageAlt || article.title}
          fill
          className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {/* ── Contenu ───────────────────────────────────────────────────── */}
      <div className="flex flex-col items-start flex-1 min-h-[12.5rem]">
        <Link 
          href={`/${locale}/categories/${article.category.slug}`}
          className="label-category text-[var(--color-oree)] hover:text-[var(--color-oree-dark)] mb-3 transition-colors"
        >
          {article.category.title}
        </Link>

        <Link href={`/${locale}/articles/${article.slug}`} className="block w-full">
          <h3 className="font-editorial text-[var(--text-headline)] leading-[1.3] text-[var(--color-ink-950)] group-hover:text-[var(--color-oree)] transition-colors line-clamp-2 mb-4">
  {article.title}
</h3>
        </Link>

        {/* Repousse la meta en bas si les titres ont des tailles différentes */}
        <div className="mt-auto pt-4 w-full">
          <ArticleMeta 
            author={article.author}
            publishedAt={article.publishedAt}
            readingTime={article.readingTime}
            locale={locale}
            dict={dict}
          />
        </div>
      </div>

    </article>
  )
}
