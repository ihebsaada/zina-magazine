"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { submitContactMessage } from "@/features/contact/actions";

interface ContactFormProps {
  locale: "en" | "ar";
}

export function ContactForm({ locale }: ContactFormProps) {
  const isRTL = locale === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const t = {
    name: isRTL ? "الاسم الكامل" : "Full Name",
    namePlaceholder: isRTL ? "أدخل اسمك الكامل" : "Enter your full name",
    email: isRTL ? "البريد الإلكتروني" : "Email Address",
    emailPlaceholder: isRTL ? "your@email.com" : "your@email.com",
    subject: isRTL ? "الموضوع (اختياري)" : "Subject (Optional)",
    subjectPlaceholder: isRTL ? "ما هو موضوع رسالتك؟" : "What is this about?",
    message: isRTL ? "الرسالة" : "Message",
    messagePlaceholder: isRTL ? "اكتب رسالتك هنا…" : "Write your message here…",
    submit: isRTL ? "إرسال الرسالة" : "Send Message",
    sending: isRTL ? "جاري الإرسال…" : "Sending...",
    maxLengthHint: (current: number, max: number) =>
      isRTL ? `${current}/${max} حرف` : `${current}/${max} characters`,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setFeedback("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("subject", subject.trim());
      formData.append("message", message.trim());
      formData.append("locale", locale);

      const result = await submitContactMessage({}, formData);

      if (result.success) {
        setStatus("success");
        setFeedback(result.message || (isRTL ? "تم إرسال رسالتك. شكراً لتواصلك مع ZINA." : "Message sent. Thank you for contacting ZINA."));
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
        setFeedback(result.error || (isRTL ? "تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى." : "Unable to send message. Please try again."));
      }
    } catch {
      setStatus("error");
      setFeedback(isRTL ? "تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى." : "Unable to send message. Please try again.");
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="p-8 bg-[var(--color-paper-alt)] border border-[var(--color-ink-200)] shadow-sm"
    >
      <h3 className="font-editorial text-2xl text-[var(--color-ink-950)] mb-6">
        {isRTL ? "أرسل لنا رسالة" : "Send Us a Message"}
      </h3>

      {status === "success" ? (
        <div className="flex items-center gap-3 text-[var(--color-sage)] py-4">
          <CheckCircle className="w-6 h-6 shrink-0" />
          <span className="text-base font-medium">{feedback}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === "error" && (
            <div className="p-4 bg-[var(--color-blush-pale)] border-l-4 border-[var(--color-blush)] text-sm text-[var(--color-blush)]">
              {feedback}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-700)] mb-2">
              {t.name} <span className="text-[var(--color-blush)]">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              disabled={status === "loading"}
              className="w-full px-4 py-3 bg-[var(--color-paper)] border border-[var(--color-ink-200)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] focus:outline-none focus:border-[var(--color-oree)] transition-colors text-sm"
            />
            <p className="text-right text-[10px] text-[var(--color-ink-400)] mt-1">
              {t.maxLengthHint(name.length, 80)}
            </p>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-700)] mb-2">
              {t.email} <span className="text-[var(--color-blush)]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              disabled={status === "loading"}
              className="w-full px-4 py-3 bg-[var(--color-paper)] border border-[var(--color-ink-200)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] focus:outline-none focus:border-[var(--color-oree)] transition-colors text-sm ltr:text-left rtl:text-right"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-700)] mb-2">
              {t.subject}
            </label>
            <input
              type="text"
              maxLength={120}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t.subjectPlaceholder}
              disabled={status === "loading"}
              className="w-full px-4 py-3 bg-[var(--color-paper)] border border-[var(--color-ink-200)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] focus:outline-none focus:border-[var(--color-oree)] transition-colors text-sm"
            />
            <p className="text-right text-[10px] text-[var(--color-ink-400)] mt-1">
              {t.maxLengthHint(subject.length, 120)}
            </p>
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-700)] mb-2">
              {t.message} <span className="text-[var(--color-blush)]">*</span>
            </label>
            <textarea
              required
              maxLength={2000}
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              disabled={status === "loading"}
              className="w-full px-4 py-3 bg-[var(--color-paper)] border border-[var(--color-ink-200)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] focus:outline-none focus:border-[var(--color-oree)] transition-colors text-sm resize-none"
            />
            <p className="text-right text-[10px] text-[var(--color-ink-400)] mt-1">
              {t.maxLengthHint(message.length, 2000)}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold uppercase tracking-wider bg-[var(--color-ink-950)] text-[var(--color-paper)] hover:bg-[var(--color-oree-dark)] disabled:opacity-50 transition-colors duration-[var(--duration-base)] cursor-pointer"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.sending}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.submit}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
