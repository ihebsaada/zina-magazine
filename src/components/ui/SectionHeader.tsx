import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  /** Optionnel : élément d'action à afficher à droite (ex: bouton "Voir plus") */
  action?: React.ReactNode
  /** Centrer le texte au lieu de l'alignement naturel LTR/RTL */
  centered?: boolean
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, subtitle, action, centered = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col',
          centered ? 'items-center text-center' : 'items-start',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'flex w-full items-end justify-between',
            centered && 'justify-center'
          )}
        >
          <h2 className="font-editorial text-[var(--text-headline)] leading-tight text-[var(--color-ink-950)]">
            {title}
          </h2>
          {action && !centered && <div className="ms-4 shrink-0">{action}</div>}
        </div>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-[var(--text-lead)] italic text-[var(--color-ink-700)]">
            {subtitle}
          </p>
        )}

        <hr className="rule-oree w-full mt-6 mb-8" />
      </div>
    )
  }
)

SectionHeader.displayName = 'SectionHeader'

export { SectionHeader }
