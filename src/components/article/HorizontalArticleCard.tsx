import Image from "next/image";
import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import type { ArticleCard as ArticleCardType } from "@/types/magazine";
import { ArticleMeta } from "./ArticleMeta";
import { cn } from "@/lib/utils";

interface HorizontalArticleCardProps {
  article: ArticleCardType;
  locale: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  className?: string;
}

export function HorizontalArticleCard({
  article,
  locale,
  dict,
  className,
}: HorizontalArticleCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col sm:flex-row gap-6 lg:gap-8 items-start",
        className,
      )}
    >
      {/* ── Image (Small/Medium) ────────────────────────────────────────── */}
      <Link
        href={`/${locale}/articles/${article.slug}`}
        className="block w-full sm:w-48 md:w-64 shrink-0 overflow-hidden aspect-[4/3] sm:aspect-square bg-[var(--color-ink-100)] relative"
      >
        <Image
          src={article.coverImage}
          alt={article.coverImageAlt || article.title}
          fill
          className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 256px"
        />
      </Link>

      {/* ── Contenu ────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-start py-2 sm:py-4">
        <Link
          href={`/${locale}/categories/${article.category.slug}`}
          className="label-category text-[var(--color-oree)] hover:text-[var(--color-oree-dark)] mb-2 transition-colors"
        >
          {article.category.title}
        </Link>

        <Link href={`/${locale}/articles/${article.slug}`} className="block">
          <h3 className="font-editorial text-2xl lg:text-3xl leading-tight text-[var(--color-ink-950)] group-hover:text-[var(--color-oree)] transition-colors text-balance mb-3 line-clamp-2">
            {article.title}
          </h3>
        </Link>

        <p className="text-[var(--text-body)] text-[var(--color-ink-600)] mb-4 line-clamp-2 lg:line-clamp-3">
          {article.excerpt}
        </p>

        <ArticleMeta
          author={article.author}
          publishedAt={article.publishedAt}
          readingTime={article.readingTime}
          locale={locale}
          dict={dict}
        />
      </div>
    </article>
  );
}
