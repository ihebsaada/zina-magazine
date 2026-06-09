import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/features/contact/components/ContactForm";

const content = {
  en: {
    title: "Contact Us",
    subtitle:
      "We would love to hear from you. For editorial pitches, partnerships, or general inquiries, please reach out to us directly.",
    emailLabel: "General Inquiries",
    email: "hello@ZINA.magazine",
    pressLabel: "Press & Partnerships",
    pressEmail: "partnerships@ZINA.magazine",
    metaTitle: "Contact | ZINA Magazine",
    metaDesc: "Get in touch with ZINA Magazine for editorial inquiries and partnerships.",
  },
  ar: {
    title: "اتصل بنا",
    subtitle:
      "نود أن نسمع منك. للعروض التحريرية، الشراكات، أو الاستفسارات العامة، يرجى التواصل معنا مباشرة.",
    emailLabel: "استفسارات عامة",
    email: "hello@ZINA.magazine",
    pressLabel: "الصحافة والشراكات",
    pressEmail: "partnerships@ZINA.magazine",
    metaTitle: "تواصل معنا | ZINA Magazine",
    metaDesc: "تواصل مع مجلة ZINA للاستفسارات التحريرية والشراكات.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved = isValidLocale(locale) ? (locale as Locale) : "en";
  const text = content[resolved];

  return {
    title: text.metaTitle,
    description: text.metaDesc,
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const resolved = locale as Locale;
  const text = content[resolved];

  return (
    <main className="flex-1 pb-32">
      {/* Page Header */}
      <section className="pt-24 pb-16 border-b border-[var(--color-ink-200)] bg-[var(--color-paper)]">
        <Container variant="prose" className="text-center">
          <h1 className="font-editorial text-[var(--text-display)] text-[var(--color-ink-950)] leading-tight mb-6">
            {text.title}
          </h1>
          <p className="text-[var(--text-lead)] italic text-[var(--color-ink-600)]">
            {text.subtitle}
          </p>
        </Container>
      </section>

      {/* Contact Section: Two Columns on Desktop, Stacked on Mobile */}
      <section className="py-24 animate-fade-in">
        <Container variant="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Column: Direct Emails */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-3 p-6 bg-[var(--color-paper)] border border-[var(--color-ink-100)]">
                <h2 className="text-[var(--text-caption)] font-medium text-[var(--color-ink-500)] uppercase tracking-widest">
                  {text.emailLabel}
                </h2>
                <a
                  href={`mailto:${text.email}`}
                  className="block text-xl font-editorial text-[var(--color-ink-950)] hover:text-[var(--color-oree)] transition-colors break-all"
                  dir="ltr"
                >
                  {text.email}
                </a>
              </div>

              <div className="space-y-3 p-6 bg-[var(--color-paper)] border border-[var(--color-ink-100)]">
                <h2 className="text-[var(--text-caption)] font-medium text-[var(--color-ink-500)] uppercase tracking-widest">
                  {text.pressLabel}
                </h2>
                <a
                  href={`mailto:${text.pressEmail}`}
                  className="block text-xl font-editorial text-[var(--color-ink-950)] hover:text-[var(--color-oree)] transition-colors break-all"
                  dir="ltr"
                >
                  {text.pressEmail}
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm locale={resolved} />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
