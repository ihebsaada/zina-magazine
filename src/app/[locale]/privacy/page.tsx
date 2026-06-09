import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";

const content = {
  en: {
    title: "Privacy Policy",
    subtitle: "Your privacy is of paramount importance to us. Learn how we protect your personal data.",
    metaTitle: "Privacy Policy | ZINA Magazine",
    metaDesc: "Read the privacy policy of ZINA Magazine to understand how we handle your personal data.",
    sections: [
      {
        title: "Introduction",
        text: "ZINA Magazine is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.",
      },
      {
        title: "Information we collect",
        text: "We may collect personal information such as your name and email address when you voluntarily sign up for our newsletter, submit a contact form, or interact with our site features.",
      },
      {
        title: "How we use information",
        text: "We use the information we collect to deliver newsletter content, respond to comments and inquiries, and improve the user experience of ZINA Magazine.",
      },
      {
        title: "Cookies and analytics",
        text: "We use essential cookies and basic analytics tools to understand how visitors interact with our site, helping us optimize performance and content layout.",
      },
      {
        title: "Newsletter",
        text: "If you subscribe to our newsletter, we store your email address securely. You can unsubscribe at any time using the link at the bottom of any newsletter email.",
      },
      {
        title: "Contact",
        text: "For any questions or concerns regarding this Privacy Policy, please reach out to us at privacy@zina.magazine.",
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    subtitle: "خصوصيتكم ذات أهمية بالغة بالنسبة لنا. تعرفوا على كيفية حماية بياناتكم الشخصية.",
    metaTitle: "سياسة الخصوصية | مجلة زينة",
    metaDesc: "اقرأ سياسة الخصوصية الخاصة بمجلة زينة لفهم كيفية تعاملنا مع بياناتك الشخصية.",
    sections: [
      {
        title: "مقدمة",
        text: "تلتزم مجلة زينة (ZINA) بحماية بياناتكم الشخصية. وتوضح سياسة الخصوصية هذه كيفية جمع معلوماتكم واستخدامها وحمايتها عند زيارتكم لموقعنا.",
      },
      {
        title: "المعلومات التي نجمعها",
        text: "قد نقوم بجمع معلومات شخصية مثل اسمكم وبريدكم الإلكتروني عندما تسجلون اختيارياً في نشرتنا الإخبارية، أو ترسلون نموذج اتصال، أو تتفاعلون مع ميزات موقعنا.",
      },
      {
        title: "كيفية استخدام المعلومات",
        text: "نستخدم المعلومات التي نجمعها لتقديم محتوى النشرة الإخبارية، والرد على التعليقات والاستفسارات، وتحسين تجربة المستخدم في مجلة زينة.",
      },
      {
        title: "ملفات تعريف الارتباط والتحليلات",
        text: "نستخدم ملفات تعريف الارتباط الأساسية وأدوات التحليل البسيطة لفهم كيفية تفاعل الزوار مع موقعنا، مما يساعدنا على تحسين الأداء وتخطيط المحتوى.",
      },
      {
        title: "النشرة الإخبارية",
        text: "إذا اشتركت في نشرتنا الإخبارية، فإننا نقوم بتخزين عنوان بريدك الإلكتروني بشكل آمن. يمكنك إلغاء الاشتراك في أي وقت عبر الرابط الموجود في أسفل البريد الإلكتروني للنشرة.",
      },
      {
        title: "الاتصال بنا",
        text: "لأي أسئلة أو استفسارات تتعلق بسياسة الخصوصية هذه، يرجى التواصل معنا عبر البريد الإلكتروني: privacy@zina.magazine.",
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

export default async function PrivacyPage({
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
