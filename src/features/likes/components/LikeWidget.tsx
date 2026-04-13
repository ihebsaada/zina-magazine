"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/features/likes/actions";
import { getOrCreateSessionId } from "@/lib/utils/session";

interface LikeWidgetProps {
  articleId: string;
  locale: "en" | "ar";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  initialLikeCount?: number;
}

export function LikeWidget({
  articleId,
  locale,
  initialLikeCount,
}: LikeWidgetProps) {
  const isRTL = locale === "ar";
  const t = {
    likes: isRTL ? "إعجابات" : "Likes",
  };

  const [likeCount, setLikeCount] = useState(initialLikeCount ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;

    fetch(`/api/likes?articleId=${articleId}&sessionId=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        setIsLiked(data.isLiked ?? false);
      })
      .catch(() => {});
  }, [articleId]);

  const handleLike = async () => {
    if (likeLoading) return;
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;
    setLikeLoading(true);

    const optimisticLiked = !isLiked;
    setIsLiked(optimisticLiked);
    setLikeCount((prev) => (optimisticLiked ? prev + 1 : prev - 1));

    try {
      const actionType = optimisticLiked ? "like" : "unlike";
      const result = await toggleLike(articleId, sessionId, actionType);

      if (result.error) {
        setIsLiked(!optimisticLiked);
        setLikeCount((prev) => (optimisticLiked ? prev - 1 : prev + 1));
      }
    } catch {
      setIsLiked(!optimisticLiked);
      setLikeCount((prev) => (optimisticLiked ? prev - 1 : prev + 1));
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={likeLoading}
      className={cn(
        "flex items-center gap-3 transition-colors group",
        isLiked
          ? "text-[var(--color-oree)]"
          : "text-[var(--color-ink-600)] hover:text-[var(--color-oree)]",
      )}
      aria-label={t.likes}
      aria-pressed={isLiked}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-transform group-active:scale-90",
          isLiked && "fill-current",
          likeLoading && "opacity-50",
        )}
        strokeWidth={1.5}
      />
      <span className="font-medium text-sm tabular-nums">{likeCount}</span>
      <span className="sr-only sm:not-sr-only text-sm font-medium">
        {t.likes}
      </span>
    </button>
  );
}
