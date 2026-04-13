"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { CommentForm } from "./CommentForm";

import type { CommentReturnData } from "@/features/comments/actions";

interface CommentsSectionProps {
  articleId: string;
  locale: "en" | "ar";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  initialComments?: CommentReturnData[];
  children?: React.ReactNode;
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-MA" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CommentsSection({
  articleId,
  locale,
  dict,
  children,
  initialComments,
}: CommentsSectionProps) {
  const isRTL = locale === "ar";

  const [comments, setComments] = useState<CommentReturnData[]>(
    initialComments ?? [],
  );
  const [showForm, setShowForm] = useState(false);

  const handleCommentAdded = (newComment: CommentReturnData) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const t = {
    comments:
      dict?.article?.comments?.title ?? (isRTL ? "التعليقات" : "Comments"),
    addComment: isRTL ? "أضف تعليقاً" : "Add a comment",
    yourName: isRTL ? "اسمك" : "Your name",
    yourComment: isRTL ? "شاركنا رأيك…" : "Share your thoughts…",
    post: isRTL ? "نشر" : "Post",
    cancel: isRTL ? "إلغاء" : "Cancel",
    beFirst: isRTL ? "كن أول من يعلّق." : "Be the first to comment.",
  };

  return (
    <div>
      <div className="flex items-center gap-8 py-6 border-y border-[var(--color-ink-200)]">
        {children}

        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-3 text-[var(--color-ink-600)] hover:text-[var(--color-ink-950)] transition-colors group"
          aria-label={t.comments}
          aria-expanded={showForm}
        >
          <MessageCircle
            className="w-5 h-5 transition-transform group-active:scale-90"
            strokeWidth={1.5}
          />
          <span className="font-medium text-sm tabular-nums">
            {comments.length}
          </span>
          <span className="sr-only sm:not-sr-only text-sm font-medium">
            {t.comments}
          </span>
        </button>
      </div>

      {showForm && (
        <CommentForm
          articleId={articleId}
          locale={locale}
          t={t}
          onSuccess={handleCommentAdded}
          onCancel={() => setShowForm(false)}
        />
      )}

      {comments.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="font-editorial text-xl text-[var(--color-ink-950)]">
            {t.comments} ({comments.length})
          </h3>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-[var(--color-ink-100)] pb-6"
              dir={comment.locale === "ar" ? "rtl" : "ltr"}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-medium text-sm text-[var(--color-ink-900)]">
                  {comment.author_name}
                </span>
                <time className="text-xs text-[var(--color-ink-400)]">
                  {formatDate(comment.created_at, comment.locale)}
                </time>
              </div>
              <p className="text-sm text-[var(--color-ink-700)] leading-relaxed">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {comments.length === 0 && !showForm && (
        <p className="mt-4 text-sm text-[var(--color-ink-400)] italic">
          {t.beFirst}
        </p>
      )}
    </div>
  );
}
