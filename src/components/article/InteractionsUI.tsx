"use client";

/**
 * components/article/InteractionsUI.tsx
 *
 * Conteneur principal reconstruit pour la lisibilité (Refactoring)
 * Coordonne les deux widgets métiers autonomes :
 * - LikeWidget (Server Actions)
 * - CommentsSection (Server Actions)
 */

import { cn } from "@/lib/utils";
import { LikeWidget } from "@/features/likes/components/LikeWidget";
import { CommentsSection } from "@/features/comments/components/CommentsSection";
import { ShareButton } from "@/components/article/ShareButton";

interface InteractionsUIProps {
  articleId: string;
  articleSlug?: string;
  articleTitle?: string;
  locale: "en" | "ar";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialComments?: any[];
  initialLikeCount?: number;
}

export function InteractionsUI({
  articleId,
  articleSlug,
  articleTitle,
  locale,
  dict,
  className,
  initialComments,
  initialLikeCount,
}: InteractionsUIProps) {
  return (
    <div className={cn("mt-8", className)}>
      <CommentsSection
        articleId={articleId}
        articleSlug={articleSlug}
        articleTitle={articleTitle}
        locale={locale}
        dict={dict}
        initialComments={initialComments}
        shareSlot={
          <ShareButton
            locale={locale}
            title={articleTitle ?? ""}
            slug={articleSlug ?? ""}
          />
        }
      >
        <LikeWidget
          articleId={articleId}
          locale={locale}
          dict={dict}
          initialLikeCount={initialLikeCount}
        />
      </CommentsSection>
    </div>
  );
}
