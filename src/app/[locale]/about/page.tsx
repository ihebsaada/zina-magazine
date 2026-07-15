import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getAboutPage } from "@/lib/sanity/queries";
import { Container } from "@/components/ui/Container";
import { ArticleBody } from "@/components/article/ArticleBody";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved = isValidLocale(locale) ? (locale as Locale) : "en";
  const aboutPage = await getAboutPage(resolved);

  return {
    title: aboutPage?.seoTitle || "About | ZINA Magazine",
    description: aboutPage?.seoDescription || aboutPage?.mission,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const resolved = locale as Locale;
  const aboutPage = await getAboutPage(resolved);

  if (!aboutPage) notFound();

  return (
    <main className="flex-1 pb-32">
      {/* Page Header */}
      <section className="pt-24 pb-16 border-b border-[var(--color-ink-200)] bg-[var(--color-paper)]">
        <Container variant="prose" className="text-center">
          <h1 className="font-editorial text-[var(--text-display)] text-[var(--color-ink-950)] leading-tight mb-6">
            {aboutPage.title}
          </h1>
          <p className="text-[var(--text-lead)] italic text-[var(--color-ink-600)]">
            {aboutPage.mission}
          </p>
        </Container>
      </section>

      {/* Hero image */}
      {aboutPage.heroImage && (
        <div className="w-full max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-12 -mt-8 sm:-mt-12 relative z-10">
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--color-ink-100)] shadow-2xl shadow-[var(--color-ink-950)]/5">
            <Image
              src={aboutPage.heroImage}
              alt={aboutPage.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Content Section */}
      <section className="py-24" dir={resolved === "ar" ? "rtl" : "ltr"}>
        <Container variant="prose">
          <ArticleBody body={aboutPage.body} />
        </Container>
      </section>
    </main>
  );
}
