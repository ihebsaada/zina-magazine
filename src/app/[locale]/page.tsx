import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { FeaturedArticleCard } from "@/components/article/FeaturedArticleCard";
import { ArticleCard } from "@/components/article/ArticleCard";
import { HorizontalArticleCard } from "@/components/article/HorizontalArticleCard";
import { AdBanner } from "@/components/ads/AdBanner";
import { NewsletterForm } from "@/features/newsletter/components/NewsletterForm";
import {
  getFeaturedArticle,
  getLatestArticles,
  getArticlesByCategory,
} from "@/lib/sanity/queries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const resolved = locale as Locale;
  const dict = await getDictionary(resolved);

  // ─── Fetching Sanity ──
  const featuredArticle = await getFeaturedArticle(resolved);
  const latestArticles = await getLatestArticles(
    resolved,
    featuredArticle?._id,
    3,
  );
  const cultureArticlesRaw = await getArticlesByCategory("culture", resolved);

  const cultureArticles = cultureArticlesRaw.filter(
    (art) =>
      art._id !== featuredArticle?._id &&
      !latestArticles.find((l) => l._id === art._id),
  );

  const hasCultureHighlight = cultureArticles.length > 0;

  return (
    <main className="flex-1 pb-32">
      {/* ── AD BANNER ───────────────────────── */}
      <section className="mb-8 lg:mb-12">
        <AdBanner />
      </section>

      {/* ── 1. HERO SECTION ─────────────────────────────────────────────── */}
      <section className="pt-8 pb-16 lg:pt-16 lg:pb-24">
        <Container>
          {featuredArticle && (
            <FeaturedArticleCard
              article={featuredArticle}
              locale={resolved}
              dict={dict}
            />
          )}
        </Container>
      </section>

      {/* ── 2. LATEST ARTICLES (GRID) ───────────────────────────────────── */}
      <section className="py-16">
        <Container>
          <SectionHeader
            title={dict.home.latestArticles}
            action={<Button variant="link">{dict.nav.readMore}</Button>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {latestArticles.map((article, index) => (
              <ArticleCard
                key={article._id}
                article={article}
                locale={resolved}
                dict={dict}
                aspectRatio={index === 0 ? "landscape" : "portrait"} // Casse la monotonie
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. CATEGORY HIGHLIGHT ───────────────────────────────────────── */}
      {hasCultureHighlight && (
        <section className="py-24 bg-[var(--color-paper)] mt-16">
          <Container>
            <SectionHeader
              title={dict.nav.culture}
              action={<Button variant="outline">{dict.nav.readMore}</Button>}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {cultureArticles.map((article) => (
                <HorizontalArticleCard
                  key={article._id}
                  article={article}
                  locale={resolved}
                  dict={dict}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── 4. NEWSLETTER ───────────────────────────────────────────────── */}
      <section className="py-32">
        <Container variant="prose" className="text-center">
          <NewsletterForm locale={resolved} dict={dict} />
        </Container>
      </section>
    </main>
  );
}
