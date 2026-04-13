import { notFound } from 'next/navigation'
import Image from 'next/image'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { Container } from '@/components/ui/Container'

export const metadata = {
  title: 'About Us | Xmedia Magazine',
  description: 'Our vision and identity.',
}

const content = {
  en: {
    title: 'About Xmedia',
    subtitle: 'Redefining Digital Journalism',
    vision: 'Our Vision',
    visionText: 'Xmedia was founded on a simple premise: in an age of infinite scrolling and shallow engagement, there is a profound hunger for curated, meaningful storytelling. We believe that digital media can be just as elegant, tactile, and lasting as print. Our pages are designed to let the mind breathe and the eye linger.',
    identity: 'Our Identity',
    identityText: 'We bridge the gap between contemporary design, mindful living, and cultural heritage. From independent creators to established voices, we elevate narratives that shift perspectives. We are not just a magazine; we are an archive of modern elegance.',
  },
  ar: {
    title: 'عن إكس ميديا',
    subtitle: 'إعادة تعريف الصحافة الرقمية',
    vision: 'رؤيتنا',
    visionText: 'تأسست إكس ميديا على فرضية بسيطة: في عصر التصفح اللانهائي والاهتمام السطحي، هناك تعطش عميق للقصص المنسقة وذات المغزى. نحن نؤمن بأن الإعلام الرقمي يمكن أن يكون أنيقاً، ملموساً ودائماً تماماً كالمطبوعات. صُممت صفحاتنا لتدع العقل يتنفس والعين تتأمل.',
    identity: 'هويتنا',
    identityText: 'نحن نسد الفجوة بين التصميم المعاصر، الحياة الواعية، والتراث الثقافي. بدءاً من المبدعين المستقلين إلى الأصوات الراسخة، نحن نرتقي بالسرديات التي تغير وجهات النظر. نحن لسنا مجرد مجلة؛ نحن أرشيف للأناقة الحديثة.',
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const resolved = locale as Locale
  const text = content[resolved]

  return (
    <main className="flex-1 pb-32">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[var(--color-ink-200)] bg-[var(--color-paper)]">
        <Container className="text-center">
          <h1 className="font-editorial text-[var(--text-display)] text-[var(--color-ink-950)] leading-tight mb-6">
            {text.title}
          </h1>
          <p className="font-editorial text-2xl lg:text-3xl text-[var(--color-oree)] italic">
            {text.subtitle}
          </p>
        </Container>
      </section>

      {/* ── MANIFESTO CONTENT ─────────────────────────────────────────── */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Image éditoriale forte */}
            <div className="lg:col-span-5 relative aspect-[4/5] bg-[var(--color-ink-100)] w-full max-w-md mx-auto lg:max-w-none">
              <Image 
                src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200"
                alt="Editorial architectural abstraction"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Détail "Tape" / Cadre magazine */}
              <div className="absolute -inset-4 border border-[var(--color-ink-200)] pointer-events-none hidden lg:block -z-10 translate-x-4 -translate-y-4" />
            </div>

            {/* Texte de Vision */}
            <div className="lg:col-span-7 prose-editorial">
              <h2>{text.vision}</h2>
              <p className="text-xl leading-relaxed text-[var(--color-ink-700)]">
                {text.visionText}
              </p>

              <h2>{text.identity}</h2>
              <p className="text-xl leading-relaxed text-[var(--color-ink-700)]">
                {text.identityText}
              </p>
            </div>

          </div>
        </Container>
      </section>

    </main>
  )
}
