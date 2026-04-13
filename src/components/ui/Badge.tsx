import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  /** 'oree' = doré premium, 'ink' = noir profond, 'sage' = naturel/pastel */
  variant?: 'oree' | 'ink' | 'sage' | 'outline'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, children, variant = 'oree', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center label-category',
          'px-2.5 py-1 rounded-[var(--radius-card)]', // Coins légèrement arrondis mais carrés (éditorial)
          'transition-colors duration-[var(--duration-fast)]',
          {
            'bg-[var(--color-oree)] text-[var(--color-parchment)]': variant === 'oree',
            'bg-[var(--color-ink-900)] text-[var(--color-parchment)]': variant === 'ink',
            'bg-[var(--color-sage-pale)] text-[var(--color-sage-light)]': variant === 'sage',
            'border border-[var(--color-ink-200)] text-[var(--color-ink-700)] bg-transparent':
              variant === 'outline',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
