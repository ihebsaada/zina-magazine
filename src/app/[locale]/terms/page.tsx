import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";

const content = {
  en: {
    title: "Terms of Service",
    subtitle: "Please read these terms carefully before using our website.",
    metaTitle: "Terms of Service | ZINA Magazine",
    metaDesc: "Read the Terms of Service of ZINA Magazine before using our website.",
    sections: [
      {
        title: "Introduction",
        text: "By accessing and using ZINA Magazine, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use the website.",
      },
      {
        title: "Use of the website",
        text: "You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.",
      },
      {
        title: "Editorial content",
        text: "All articles, photography, and multimedia contents published on ZINA Magazine are for informational and inspirational purposes. We strive for accuracy but do not guarantee completeness.",
      },
      {
        title: "Intellectual property",
        text: "All content, logos, designs, and materials on this site are the intellectual property of ZINA Magazine or its content creators and are protected by copyright laws.",
      },
      {
        title: "External links",
        text: "Our website may contain links to third-party websites. ZINA Magazine has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites.",
      },
      {
        title: "Limitation of liability",
        text: "ZINA Magazine will not be liable for any direct, indirect, or consequential damages arising out of your use of or inability to use this website.",
      },
      {
        title: "Contact",
        text: "If you have any questions about these Terms of Service, please contact us at hello@zina.magazine.",
      },
    ],
  },
  ar: {
    title: "شروط الخدمة",
    subtitle: "يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا.",
    metaTitle: "شروط الخدمة | مجلة زينة",
    metaDesc: "اقرأ شروط الخدمة الخاصة بمجلة زينة قبل استخدام موقعنا.",
    sections: [
      {
        title: "مقدمة",
        text: "من خلال الوصول إلى مجلة زينة (ZINA) واستخدامها، فإنك تقبل وتوافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق عليها، يرجى عدم استخدام الموقع.",
      },
      {
        title: "استخدام الموقع",
        text: "أنت توافق على استخدام هذا الموقع فقط لأغراض مشروعة وبطريقة لا تنتهك حقوق أي شخص آخر أو تقيد أو تمنع استخدامه للموقع والاستمتاع به.",
      },
      {
        title: "المحتوى التحريري",
        text: "جميع المقالات والصور ومحتويات الوسائط المتعددة المنشورة على مجلة زينة هي لأغراض إعلامية وإلهامية. نحن نسعى جاهدين لتحقيق الدقة ولكننا لا نضمن اكتمالها.",
      },
      {
        title: "الملكية الفكرية",
        text: "جميع المحتويات والشعارات والتصاميم والمواد الموجودة على هذا الموقع هي ملكية فكرية لمجلة زينة أو منشئي المحتوى الخاصين بها ومحمية بموجب قوانين حقوق النشر.",
      },
      {
        title: "الروابط الخارجية",
        text: "قد يحتوي موقعنا على روابط لمواقع خارجية. لا تملك مجلة زينة أي سيطرة على محتوى أو سياسات الخصوصية أو ممارسات أي مواقع خارجية ولا تتحمل أي مسؤولية عنها.",
      },
      {
        title: "تحديد المسؤولية",
        text: "لن تكون مجلة زينة مسؤولة عن أي أضرار مباشرة أو غير مباشرة أو تبعية تنشأ عن استخدامك لهذا الموقع أو عدم قدرتك على استخدامه.",
      },
      {
        title: "الاتصال بنا",
        text: "إذا كانت لديك أي أسئلة حول شروط الخدمة هذه، يرجى الاتصال بنا عبر البريد الإلكتروني: hello@zina.magazine.",
      },
    ],
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

export default async function TermsPage({
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

      {/* Content Section */}
      <section className="py-24" dir={resolved === "ar" ? "rtl" : "ltr"}>
        <Container variant="prose" className="prose-editorial">
          {text.sections.map((section, index) => (
            <div key={index} className="mb-12 last:mb-0">
              <h2 className="font-editorial text-2xl font-bold mb-4 text-[var(--color-ink-950)]">
                {section.title}
              </h2>
              <p className="text-lg leading-relaxed text-[var(--color-ink-700)]">
                {section.text}
              </p>
            </div>
          ))}
        </Container>
      </section>
    </main>
  );
}
