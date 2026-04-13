import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** Variante typique : 'wide' pour l'éditorial classique, 'prose' pour les articles centrés. */
  variant?: 'wide' | 'prose' | 'max'
  /** Si true, retire le padding asymétrique L/R défini par défaut. */
  noPadding?: boolean
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, variant = 'wide', noPadding = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full mx-auto',
          !noPadding && 'px-6 lg:px-12', // Padding safe-area respectueux (6 = 1.5rem, 12 = 3rem)
          {
            'max-w-[var(--container-wide)]': variant === 'wide', // Typiquement 1140px
            'max-w-[var(--container-prose)]': variant === 'prose', // Typiquement 68ch
            'max-w-[var(--container-max)]': variant === 'max',   // Typiquement 1320px
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'

export { Container }
