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

interface NewsletterFormProps {
  locale: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict?: any;
  className?: string;
}

export function NewsletterForm({
  locale,
  dict,
  className,
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
      (isRTL
        ? "شكراً! تم تسجيلك بنجاح."
        : "Thank you! You&apos;re subscribed."),
    duplicate:
      dict?.newsletter?.duplicate ??
      (isRTL ? "أنت مشترك بالفعل." : "You&apos;re already subscribed."),
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
        // On résout le message selon les locales UI
        setMessage(
          result.message?.includes("déjà inscrit") ? t.duplicate : t.success,
        );
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

  return (
    <div className={className} dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="font-editorial text-[var(--text-headline)] text-[var(--color-ink-950)] mb-3">
        {t.title}
      </h2>
      <p className="text-[var(--text-lead)] italic text-[var(--color-ink-600)] mb-8">
        {t.subtitle}
      </p>

      {status === "success" ? (
        <div className="flex items-center justify-center gap-3 text-[var(--color-sage)]">
          <CheckCircle className="w-5 h-5" />
          <span
            className="text-base font-medium"
            dangerouslySetInnerHTML={{ __html: message }}
          />
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
            className="flex-1 px-4 py-3 border border-[var(--color-ink-300)] bg-[var(--color-paper)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] focus:outline-none focus:border-[var(--color-oree)] transition-colors text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[var(--color-ink-950)] text-[var(--color-paper)] text-sm font-medium tracking-wide hover:bg-[var(--color-oree-dark)] transition-colors disabled:opacity-50 whitespace-nowrap"
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
