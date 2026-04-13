import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Naskh_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { isValidLocale, getDir, getHtmlLang, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "@/app/globals.css";

/* ──────────────────────────────────────────────────────────────────────────────
   TYPOGRAPHIE — next/font (zéro FOUT, préchargement optimal)
────────────────────────────────────────────────────────────────────────────── */

// Éditorial LTR : titres et pull-quotes
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

// Corps LTR : navigation, captions, UI
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// Corps et titres RTL (arabe)
const notoArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ──────────────────────────────────────────────────────────────────────────────
   GÉNÉRATION STATIQUE
────────────────────────────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

/* ──────────────────────────────────────────────────────────────────────────────
   MÉTADONNÉES
────────────────────────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dict = await getDictionary(locale);

  return {
    title: {
      template: "%s — Xmedia",
      default: dict.meta.defaultTitle,
    },
    description: dict.meta.defaultDescription,
    metadataBase: new URL("https://xmedia.magazine"),
    alternates: {
      languages: { en: "/en", ar: "/ar" },
    },
    openGraph: {
      type: "website",
      locale: locale,
    },
  };
}

/* ──────────────────────────────────────────────────────────────────────────────
   LAYOUT
────────────────────────────────────────────────────────────────────────────── */

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) notFound();

  const resolved = locale as Locale;
  const dir = getDir(resolved); // 'ltr' | 'rtl'
  const lang = getHtmlLang(resolved); // 'en'  | 'ar'
  const dict = await getDictionary(resolved);

  // Toutes les variables CSS de polices sont toujours disponibles
  const fontVars = [
    playfair.variable,
    inter.variable,
    notoArabic.variable,
  ].join(" ");

  return (
    <html lang={lang} dir={dir} className={`${fontVars} h-full`}>
      <body className="min-h-dvh flex flex-col">
        <SiteHeader locale={resolved} dict={dict} />
        <div className="flex-1 flex flex-col">{children}</div>
        <SiteFooter locale={resolved} dict={dict} />
      </body>
    </html>
  );
}
