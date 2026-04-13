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
        className="block lg:col-span-7 xl:col-span-8 overflow-hidden aspect-[4/3] lg:aspect-[16/9] bg-[var(--color-ink-100)] relative"
      >
        <Image
          src={article.coverImage}
          alt={article.coverImageAlt || article.title}
          fill
          className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
      </Link>

      {/* ── Contenu ───────────────────────────────────────────────────── */}
      <div className="flex flex-col items-start lg:col-span-5 xl:col-span-4">
        <Link href={`/${locale}/categories/${article.category.slug}`}>
          <Badge variant="oree" className="mb-6">
            {article.category.title}
          </Badge>
        </Link>

        <Link href={`/${locale}/articles/${article.slug}`} className="block">
          <h2 className="font-editorial text-[var(--text-display)] leading-tight text-[var(--color-ink-950)] group-hover:text-[var(--color-oree-dark)] transition-colors text-balance">
            {article.title}
          </h2>
        </Link>

        <p className="mt-6 text-[var(--text-lead)] leading-relaxed text-[var(--color-ink-700)] italic border-s-2 border-transparent rtl:border-e-2 rtl:border-s-0 ps-4 rtl:ps-0 rtl:pe-4 border-[var(--color-oree)]">
          {article.excerpt}
        </p>

        <ArticleMeta
          author={article.author}
          publishedAt={article.publishedAt}
          readingTime={article.readingTime}
          locale={locale}
          dict={dict}
          className="mt-8"
        />
      </div>
    </article>
  );
}
