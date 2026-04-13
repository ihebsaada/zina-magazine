import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Styles de base partagés
          "inline-flex items-center justify-center whitespace-nowrap",
          "font-body text-[0.875rem] font-medium tracking-wide uppercase",
          "transition-all duration-[var(--duration-base)] ease-[var(--ease-editorial)]",
          "disabled:pointer-events-none disabled:opacity-50 ring-offset-[var(--color-parchment)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oree)] focus-visible:ring-offset-2",

          // Variantes visuelles
          {
            // Primary : fond orée chaud
            "bg-[var(--color-oree)] text-[var(--color-parchment)] hover:bg-[var(--color-oree-dark)]":
              variant === "primary",
            // Secondary : fond noir encre
            "bg-[var(--color-ink-900)] text-[var(--color-parchment)] hover:bg-[var(--color-ink-800)]":
              variant === "secondary",
            // Outline : bordure élégante, texte encre
            "border border-[var(--color-ink-300)] bg-transparent text-[var(--color-ink-900)] hover:border-[var(--color-ink-900)]":
              variant === "outline",
            // Ghost : fond transparent, hover léger parchment
            "bg-transparent text-[var(--color-ink-800)] hover:bg-[var(--color-ink-100)]":
              variant === "ghost",
            // Link : texte souligné avec l'animation éditoriale standard
            "bg-transparent text-[var(--color-ink-900)] nav-link":
              variant === "link",
          },

          // Tailles
          {
            "h-11 px-8 rounded-none": size === "default", // Bouton carré éditorial
            "h-9 px-4 rounded-none text-[0.75rem]": size === "sm",
            "h-14 px-10 rounded-none text-[1rem]": size === "lg",
            "h-11 w-11 rounded-none": size === "icon",
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
