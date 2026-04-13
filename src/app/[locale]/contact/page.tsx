import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Contact | Xmedia Magazine',
  description: 'Get in touch with us.',
}

const content = {
  en: {
    title: 'Contact Us',
    subtitle: 'We would love to hear from you. For editorial pitches, partnerships, or general inquiries, please use the form below.',
    name: 'Full Name',
    email: 'Email Address',
    subject: 'Subject',
    message: 'Your Message',
    send: 'Send Message'
  },
  ar: {
    title: 'اتصل بنا',
    subtitle: 'نود أن نسمع منك. للعروض التحريرية، الشراكات، أو الاستفسارات العامة، يرجى استخدام النموذج أدناه.',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    subject: 'الموضوع',
    message: 'رسالتك',
    send: 'إرسال الرسالة'
  }
}

export default async function ContactPage({
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

      {/* ── CONTACT FORM ──────────────────────────────────────────────── */}
      <section className="py-24">
        <Container variant="prose">
          
          <form className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label htmlFor="name" className="text-[var(--text-caption)] font-medium text-[var(--color-ink-500)] uppercase tracking-widest">
                  {text.name}
                </label>
                <Input id="name" type="text" placeholder={text.name} required />
              </div>
              <div className="space-y-3">
                <label htmlFor="email" className="text-[var(--text-caption)] font-medium text-[var(--color-ink-500)] uppercase tracking-widest">
                  {text.email}
                </label>
                <Input id="email" type="email" placeholder={text.email} required />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="subject" className="text-[var(--text-caption)] font-medium text-[var(--color-ink-500)] uppercase tracking-widest">
                {text.subject}
              </label>
              <Input id="subject" type="text" placeholder={text.subject} required />
            </div>

            <div className="space-y-3">
              <label htmlFor="message" className="text-[var(--text-caption)] font-medium text-[var(--color-ink-500)] uppercase tracking-widest">
                {text.message}
              </label>
              <Textarea id="message" placeholder={text.message} rows={6} required />
            </div>

            {/* Note : bouton aligné en start pour un look éditorial plus confiant que pleine largeur */}
            <div className="pt-4 flex justify-start">
              <Button type="button" variant="primary">
                {text.send}
              </Button>
            </div>
          </form>

        </Container>
      </section>

    </main>
  )
}
