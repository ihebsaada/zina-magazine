import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center py-24 md:py-32 bg-[var(--color-paper)]">
      <Container className="text-center max-w-2xl mx-auto flex flex-col items-center">
        {/* Le grand 404 décoratif en fond */}
        <h2 className="font-editorial text-[10rem] md:text-[14rem] leading-none text-[var(--color-ink-950)] opacity-[0.03] mb-0 font-bold select-none pointer-events-none">
          404
        </h2>
        
        <div className="-mt-16 md:-mt-24 relative z-10 w-full">
          {/* ─── Anglais ─── */}
          <div className="mb-10">
            <h3 className="font-editorial text-3xl md:text-4xl text-[var(--color-ink-950)] mb-4">
              Page not found
            </h3>
            <p className="font-body text-base md:text-[var(--text-lead)] text-[var(--color-ink-600)]">
              The article or category you are looking for does not exist or has been moved.
            </p>
          </div>

          {/* Ligne séparatrice */}
          <div className="w-16 h-px bg-[var(--color-ink-200)] mx-auto mb-10"></div>

          {/* ─── Arabe ─── */}
          <div className="mb-12" dir="rtl">
            <h3 className="font-editorial text-3xl md:text-4xl text-[var(--color-ink-950)] mb-4">
              الصفحة غير موجودة
            </h3>
            <p className="font-body text-base md:text-[var(--text-lead)] text-[var(--color-ink-600)]">
              المقال أو الفئة التي تبحث عنها غير موجودة أو تم نقلها.
            </p>
          </div>

          {/* ─── Boutons de retour ─── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/en">
              <Button variant="primary" className="min-w-[200px]">Return Home</Button>
            </Link>
            <Link href="/ar">
              <Button variant="outline" className="min-w-[200px]">العودة للرئيسية</Button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  )
}
