'use client'

/**
 * src/app/[locale]/error.tsx
 * L'Error Boundary de Next.js. Isolera la panne et affichera ceci à la place du composant crashé.
 */
import { useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Brancher Sentry ou un logger côté client si nécessaire
    console.error('[Error Boundary Triggered]', error)
  }, [error])

  return (
    <main className="flex flex-1 items-center justify-center py-32 bg-[var(--color-paper)]">
      <Container className="text-center max-w-lg mx-auto">
        <h2 className="font-editorial text-4xl text-[var(--color-ink-950)] mb-6">
          Service indisponible
        </h2>
        <p className="font-body text-[var(--text-lead)] text-[var(--color-ink-600)] mb-10">
          Nous n'avons pas pu charger le contenu du magazine. Notre équipe technique a été avertie. 
          Veuillez réessayer dans quelques instants.
        </p>
        <Button 
          variant="primary"
          onClick={() => reset()} // Next.js tente de re-rendre les Server Components
          className="mx-auto"
        >
          Réessayer
        </Button>
      </Container>
    </main>
  )
}
