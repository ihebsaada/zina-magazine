import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full border-b border-[var(--color-ink-300)] bg-transparent',
          'px-3 py-2 text-[var(--text-body)] font-body text-[var(--color-ink-900)]',
          'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-editorial)]',
          'placeholder:text-[var(--color-ink-400)]',
          'focus-visible:outline-none focus-visible:border-[var(--color-oree)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
