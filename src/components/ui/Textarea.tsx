import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[140px] w-full border border-[var(--color-ink-300)] bg-transparent",
          "px-4 py-3 text-[var(--text-body)] font-body text-[var(--color-ink-900)] resize-y",
          "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-editorial)]",
          "placeholder:text-[var(--color-ink-400)]",
          "focus-visible:outline-none focus-visible:border-[var(--color-oree)] focus-visible:ring-1 focus-visible:ring-[var(--color-oree)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
