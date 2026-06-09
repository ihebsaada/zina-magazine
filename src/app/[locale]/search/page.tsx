import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { type Locale } from "@/lib/i18n";
import { searchArticles } from "@/lib/sanity/queries";
import { Container } from "@/components/ui/Container";
import { ArticleCard } from "@/components/article/ArticleCard";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  const dict = await getDictionary(locale as Locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchDict = (dict as any).search ?? {};
  const label: string = searchDict.label ?? "Search";
  return {
    title: q ? `${label}: "${q}" | ZINA Magazine` : `${label} | ZINA Magazine`,
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  const resolved = locale as Locale;
  const dict = await getDictionary(resolved);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchDict = (dict as any).search ?? {};

  const t = {
    placeholder: (searchDict.placeholder as string) ?? "Search articles...",
    label: (searchDict.label as string) ?? "Search",
    resultsFor: (searchDict.resultsFor as string) ?? "Results for",
    found: (searchDict.found as string) ?? "article found",
    foundPlural: (searchDict.foundPlural as string) ?? "articles found",
    noResults: (searchDict.noResults as string) ?? "No articles found for",
    backToHome:
      (dict.nav?.backToHome as string) ?? (resolved === "ar" ? "الرئيسية" : "Back to home"),
  };

  const isRTL = resolved === "ar";
  const query = q?.trim() ?? "";

  // Only run search if there is a query
  const results = query ? await searchArticles(query, resolved) : [];

  return (
    <main className="flex-1 pb-32">
      {/* Page header */}
      <section className="pt-12 pb-8 border-b border-[var(--color-ink-200)] bg-[var(--color-paper)]">
        <Container variant="prose" className="text-center">
          <p className="text-[0.7rem] font-medium tracking-[0.18em] uppercase text-[var(--color-oree)] mb-4">
            {t.label}
          </p>
          <h1
            className="font-editorial text-[2rem] md:text-[2.5rem] text-[var(--color-ink-950)] leading-tight"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {query ? (
              <>
                <span className="italic text-[var(--color-ink-500)]">
                  &ldquo;{query}&rdquo;
                </span>
              </>
            ) : (
              t.label
            )}
          </h1>

          {query && (
            <p className="mt-3 text-sm text-[var(--color-ink-500)]" dir={isRTL ? "rtl" : "ltr"}>
              {results.length === 0
                ? `${t.noResults} "${query}"`
                : `${results.length} ${results.length === 1 ? t.found : t.foundPlural}`}
            </p>
          )}
        </Container>
      </section>

      {/* Results */}
      <Container className="mt-10">
        {!query ? (
          /* No query state */
          <div className="text-center py-20">
            <p className="text-[var(--color-ink-400)] text-sm">
              {t.placeholder}
            </p>
          </div>
        ) : results.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 flex flex-col items-center gap-6">
            <p className="text-[var(--color-ink-500)] text-base">
              {t.noResults}{" "}
              <span className="italic text-[var(--color-ink-700)]">
                &ldquo;{query}&rdquo;
              </span>
            </p>
            <Link
              href={`/${resolved}`}
              className="text-[0.8rem] uppercase tracking-[0.12em] text-[var(--color-oree)] hover:text-[var(--color-oree-dark)] transition-colors"
            >
              {t.backToHome}
            </Link>
          </div>
        ) : (
          /* Article grid — same layout as category page */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((article) => (
              <ArticleCard key={article._id} article={article} locale={resolved} dict={dict} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
