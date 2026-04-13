import { type Locale } from "@/lib/i18n";
import type { Author } from "@/types/magazine";
import { cn } from "@/lib/utils";

interface ArticleMetaProps {
  author: Author;
  publishedAt: string;
  readingTime: number;
  locale: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  className?: string;
}

export function ArticleMeta({
  author,
  publishedAt,
  readingTime,
  locale,
  dict,
  className,
}: ArticleMetaProps) {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(publishedAt));

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 text-[var(--text-caption)] leading-6 text-[var(--color-ink-500)]",
        className,
      )}
    >
      <span className="font-medium text-[var(--color-ink-700)]">
        {dict.article.by} {author.name}
      </span>

      <span className="opacity-40" aria-hidden="true">
        ·
      </span>

      <time dateTime={publishedAt}>{formattedDate}</time>

      <span className="opacity-40" aria-hidden="true">
        ·
      </span>

      <span>
        {readingTime} {dict.article.minRead}
      </span>
    </div>
  );
}
