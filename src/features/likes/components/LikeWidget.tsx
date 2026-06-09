"use client";

import { useState, useEffect, useRef } from "react";
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;

    fetch(`/api/likes?articleId=${articleId}&sessionId=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        // Avoid stale GET overwriting optimistic/server-action state after a click
        if (userInteractedRef.current) return;
        if (data.isLiked !== undefined) {
          setIsLiked(data.isLiked);
        }
        if (data.count !== undefined) {
          setLikeCount(data.count);
        }
      })
      .catch(() => {});
  }, [articleId]);

  const handleLike = async () => {
    if (likeLoading) return;
    userInteractedRef.current = true;
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;
    setLikeLoading(true);
    setErrorMsg(null);

    const optimisticLiked = !isLiked;
    setIsLiked(optimisticLiked);
    setLikeCount((prev) => (optimisticLiked ? prev + 1 : prev - 1));

    try {
      const actionType = optimisticLiked ? "like" : "unlike";
      const result = await toggleLike(articleId, sessionId, actionType);

      if (result.success) {
        if (result.isLiked !== undefined) {
          setIsLiked(result.isLiked);
        }
        if (result.count !== undefined) {
          setLikeCount(result.count);
        }
      } else {
        // Rollback only when the server action truly fails
        setIsLiked(!optimisticLiked);
        setLikeCount((prev) => (optimisticLiked ? prev - 1 : prev + 1));
        setErrorMsg(isRTL ? "تعذر تحديث الإعجاب" : "Failed to update like");
        setTimeout(() => setErrorMsg(null), 3000);
      }
    } catch {
      // Rollback on throw/network error
      setIsLiked(!optimisticLiked);
      setLikeCount((prev) => (optimisticLiked ? prev - 1 : prev + 1));
      setErrorMsg(isRTL ? "تعذر تحديث الإعجاب" : "Failed to update like");
      setTimeout(() => setErrorMsg(null), 3000);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
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
      {errorMsg && (
        <span className="text-[10px] text-[var(--color-blush)] transition-opacity duration-300">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
