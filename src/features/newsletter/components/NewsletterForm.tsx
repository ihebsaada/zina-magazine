"use client";

/**
 * components/layout/NewsletterForm.tsx
 *
 * Formulaire d'inscription à la newsletter — connecté à /api/newsletter.
 * Utilisable dans le footer et sur la homepage.
 */

import { useState, FormEvent } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { subscribeToNewsletter } from "@/features/newsletter/actions";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  locale: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict?: any;
  className?: string;
  theme?: "light" | "dark";
}

export function NewsletterForm({
  locale,
  dict,
  className,
  theme = "light",
}: NewsletterFormProps) {
  const isRTL = locale === "ar";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const t = {
    title:
      dict?.newsletter?.title ??
      (isRTL ? "اشترك في نشرتنا" : "Subscribe to our newsletter"),
    subtitle:
      dict?.newsletter?.subtitle ??
      (isRTL
      ? "قصص تهمك، أسبوعياً."
      : "Stories that matter. Delivered weekly."),
  placeholder:
    dict?.newsletter?.placeholder ??
    (isRTL ? "بريدك الإلكتروني" : "your@email.com"),
  cta: dict?.newsletter?.cta ?? (isRTL ? "اشترك" : "Subscribe"),
  success:
    dict?.newsletter?.success ??
    (isRTL ? "شكراً! تم تسجيلك بنجاح." : "Thank you! You're subscribed."),
  duplicate:
    dict?.newsletter?.duplicate ??
    (isRTL ? "أنت مشترك بالفعل." : "You're already subscribed."),
  error:
    dict?.newsletter?.error ??
    (isRTL ? "حدث خطأ. حاول مجدداً." : "Something went wrong. Please retry."),
};

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      // Préparation du payload attendu par l'Action
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("locale", locale);

      // Appel direct de la Server Action (RPC) au lieu de l'API / fetch
      const result = await subscribeToNewsletter({}, formData);

      if (result.success) {
        setStatus("success");

        if (result.code === "duplicate") {
          setMessage(t.duplicate);
        } else {
          setMessage(result.message ?? t.success);
        }

        setEmail("");
      } else {
        setStatus("error");
        setMessage(result.error ?? t.error);
      }
    } catch {
      setStatus("error");
      setMessage(t.error);
    }
  }

  const isDark = theme === "dark";

  return (
    <div className={className} dir={isRTL ? "rtl" : "ltr"}>
      <h2
        className={cn(
          "font-editorial text-[var(--text-headline)] mb-3",
          isDark ? "text-[var(--color-paper)]" : "text-[var(--color-ink-950)]"
        )}
      >
        {t.title}
      </h2>
      <p
        className={cn(
          "text-[var(--text-lead)] italic mb-8",
          isDark ? "text-[var(--color-ink-300)]" : "text-[var(--color-ink-600)]"
        )}
      >
        {t.subtitle}
      </p>

      {status === "success" ? (
        <div className="flex items-center justify-center gap-3 text-[var(--color-sage)]">
          <CheckCircle className="w-5 h-5" />
          <span className="text-base font-medium">{message}</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            disabled={status === "loading"}
            className={cn(
              "flex-1 px-4 py-3 border focus:outline-none transition-colors text-sm disabled:opacity-50",
              isDark
                ? "border-[var(--color-ink-700)] bg-[var(--color-ink-900)] text-[var(--color-paper)] placeholder:text-[var(--color-ink-500)] focus:border-[var(--color-oree)]"
                : "border-[var(--color-ink-300)] bg-[var(--color-paper)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-oree)]"
            )}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={cn(
              "flex items-center justify-center gap-2 px-8 py-3 text-sm font-medium tracking-wide transition-colors disabled:opacity-50 whitespace-nowrap",
              isDark
                ? "bg-[var(--color-oree)] text-[var(--color-ink-950)] hover:bg-[var(--color-oree-light)]"
                : "bg-[var(--color-ink-950)] text-[var(--color-paper)] hover:bg-[var(--color-oree-dark)]"
            )}
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {t.cta}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-sm text-[var(--color-blush)] text-center">
          {message}
        </p>
      )}
    </div>
  );
}

