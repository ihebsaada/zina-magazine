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
  getHomepageSettings,
  getActiveAds,
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

  // Fetching Sanity
  // Step 1: featured article, site settings and ad banners are mutually independent
  const [featuredArticle, highlightSettings, ads] = await Promise.all([
    getFeaturedArticle(resolved),
    getHomepageSettings(resolved),
    getActiveAds(resolved).catch(() => []),
  ]);

  // Fallback: if no category is configured in siteSettings, use "culture".
  const highlightSlug = highlightSettings?.slug ?? "culture";
  const highlightTitle = highlightSettings?.title ?? dict.nav.culture;

  // Step 2: latest and highlight are independent of each other
  const [latestArticles, highlightArticlesRaw] = await Promise.all([
    getLatestArticles(resolved, featuredArticle?._id, 4),
    getArticlesByCategory(highlightSlug, resolved),
  ]);

  const highlightArticles = highlightArticlesRaw.filter(
    (art) =>
      art._id !== featuredArticle?._id &&
      !latestArticles.find((l) => l._id === art._id),
  );

  const hasHighlight = highlightArticles.length > 0;

  return (
    <main className="flex-1 pb-32">
      {/* AD BANNER */}
      <section className="mb-8 lg:mb-12">
        <AdBanner locale={resolved} ads={ads} />
      </section>

      {/* 1. HERO SECTION */}
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

      {/* 2. LATEST ARTICLES (GRID) */}
      <section className="py-16">
        <Container>
          <SectionHeader
            title={dict.home.latestArticles}
            action={<Button variant="link">{dict.nav.readMore}</Button>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-16">
            {latestArticles.map((article, index) => (
              <ArticleCard
                key={article._id}
                article={article}
                locale={resolved}
                dict={dict}
                aspectRatio={index === 0 ? "landscape" : "portrait"}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* 3. CATEGORY HIGHLIGHT */}
      {hasHighlight && (
        <section className="py-24 bg-[var(--color-paper)] mt-16">
          <Container>
            <SectionHeader
              title={highlightTitle}
              action={<Button variant="outline">{dict.nav.readMore}</Button>}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {highlightArticles.map((article) => (
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

      {/* 4. NEWSLETTER */}
      <section
        id="newsletter"
        className="mt-16 py-24 bg-[var(--color-ink-950)] border-t border-[var(--color-ink-900)]"
      >
        <Container variant="prose" className="text-center">
          <NewsletterForm locale={resolved} dict={dict} theme="dark" />
        </Container>
      </section>
    </main>
  );
}
