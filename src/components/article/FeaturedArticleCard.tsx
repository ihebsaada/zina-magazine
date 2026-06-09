import Image from "next/image";
import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import type { ArticleCard as ArticleCardType } from "@/types/magazine";
import { ArticleMeta } from "./ArticleMeta";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface FeaturedArticleCardProps {
  article: ArticleCardType;
  locale: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  className?: string;
}

export function FeaturedArticleCard({
  article,
  locale,
  dict,
  className,
}: FeaturedArticleCardProps) {
  return (
    <article
      className={cn(
        "group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center",
        className,
      )}
    >
      {/* ── Image (Large) ─────────────────────────────────────────────── */}
      <Link
        href={`/${locale}/articles/${article.slug}`}
        className="block lg:col-span-7 xl:col-span-8 overflow-hidden aspect-[4/3] lg:aspect-[16/10] bg-[var(--color-ink-100)] relative"
      >
        <Image
          src={article.coverImage}
          alt={article.coverImageAlt || article.title}
          fill
          className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        {/* Subtle dark vignette bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </Link>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="flex flex-col items-start lg:col-span-5 xl:col-span-4">
        {/* Golden rule — editorial marker */}
        <div className="w-8 h-px bg-[var(--color-oree)] mb-6" />

        <Link href={`/${locale}/categories/${article.category.slug}`}>
          <Badge variant="oree" className="mb-5">
            {article.category.title}
          </Badge>
        </Link>

        <Link href={`/${locale}/articles/${article.slug}`} className="block">
          <h2 className="font-editorial text-[var(--text-display)] leading-[1.1] text-[var(--color-ink-950)] group-hover:text-[var(--color-oree-dark)] transition-colors duration-[var(--duration-base)] text-balance">
            {article.title}
          </h2>
        </Link>

        {/* Excerpt — fixed border: use border-inline-start directly */}
        <p className="mt-6 text-[var(--text-lead)] leading-relaxed text-[var(--color-ink-600)] border-[var(--color-oree)] ps-4 italic"
          style={{ borderInlineStartWidth: '2px', borderInlineStartStyle: 'solid' }}>
          {article.excerpt}
        </p>

        <ArticleMeta
          author={article.author}
          publishedAt={article.publishedAt}
          readingTime={article.readingTime}
          locale={locale}
          dict={dict}
          className="mt-8 pt-6 border-t border-[var(--color-ink-100)] w-full"
        />
      </div>
    </article>
  );
}

