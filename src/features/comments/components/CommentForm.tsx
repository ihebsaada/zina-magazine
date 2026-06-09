"use client";

import { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { addComment } from "@/features/comments/actions";
import type { CommentReturnData } from "@/features/comments/actions";

interface CommentFormProps {
  articleId: string;
  articleSlug?: string;
  articleTitle?: string;
  locale: "en" | "ar";
  t: {
    addComment: string;
    yourName: string;
    yourComment: string;
    post: string;
    cancel: string;
  };
  onSuccess: (newComment: CommentReturnData) => void;
  onCancel: () => void;
}

export function CommentForm({
  articleId,
  articleSlug,
  articleTitle,
  locale,
  t,
  onCancel,
}: CommentFormProps) {
  const isRTL = locale === "ar";

  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !authorName.trim() || !body.trim()) return;

    setSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData();
      formData.append("articleId", articleId);
      formData.append("authorName", authorName.trim());
      formData.append("body", body.trim());
      formData.append("locale", locale);
      if (articleSlug) formData.append("articleSlug", articleSlug);
      if (articleTitle) formData.append("articleTitle", articleTitle);

      const result = await addComment({}, formData);

      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage(
          result.message ||
            (isRTL
              ? "تم إرسال التعليق. سيظهر بعد الموافقة."
              : "Comment submitted. It will appear after approval.")
        );
        setAuthorName("");
        setBody("");
        formRef.current?.reset();
        // Do NOT call onSuccess(result.comment) as the comment is pending approval
        setTimeout(() => onCancel(), 2500);
      } else {
        setSubmitStatus("error");
        const errStr = result.error || "";
        const isFetchError =
          errStr.toLowerCase().includes("fetch failed") ||
          errStr.toLowerCase().includes("typeerror") ||
          errStr.toLowerCase().includes("failed to fetch");

        setSubmitMessage(
          isFetchError
            ? (isRTL
                ? "تعذر إرسال التعليق. يرجى المحاولة مرة أخرى."
                : "Unable to send comment. Please try again.")
            : (result.error ?? (isRTL ? "حدث خطأ ما." : "Something went wrong.")),
        );
      }
    } catch (err) {
      setSubmitStatus("error");
      const errStr = err instanceof Error ? err.message : String(err);
      const isFetchError =
        errStr.toLowerCase().includes("fetch failed") ||
        errStr.toLowerCase().includes("typeerror") ||
        errStr.toLowerCase().includes("failed to fetch");

      setSubmitMessage(
        isFetchError
          ? (isRTL
              ? "تعذر إرسال التعليق. يرجى المحاولة مرة أخرى."
              : "Unable to send comment. Please try again.")
          : (isRTL ? "فشل الاتصال بالخادم." : "Connection failed."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-[var(--color-paper-alt)] border border-[var(--color-ink-200)]">
      <h3 className="font-editorial text-xl text-[var(--color-ink-950)] mb-4">
        {t.addComment}
      </h3>

      {submitStatus === "success" && (
        <p className="text-sm text-[var(--color-sage)] mb-4">{submitMessage}</p>
      )}
      {submitStatus === "error" && (
        <p className="text-sm text-[var(--color-blush)] mb-4">
          {submitMessage}
        </p>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmitComment}
        className="space-y-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <input
          type="text"
          placeholder={t.yourName}
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={80}
          required
          className="w-full px-4 py-3 bg-[var(--color-paper)] border border-[var(--color-ink-200)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] focus:outline-none focus:border-[var(--color-oree)] transition-colors text-sm"
        />
        <textarea
          placeholder={t.yourComment}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={500}
          required
          rows={4}
          className="w-full px-4 py-3 bg-[var(--color-paper)] border border-[var(--color-ink-200)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] focus:outline-none focus:border-[var(--color-oree)] transition-colors text-sm resize-none"
        />
        <p className="text-right text-xs text-[var(--color-ink-400)]">
          {body.length}/500
        </p>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-ink-950)] text-[var(--color-paper)] text-sm font-medium hover:bg-[var(--color-oree-dark)] transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {t.post}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-[var(--color-ink-500)] hover:text-[var(--color-ink-950)] transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
