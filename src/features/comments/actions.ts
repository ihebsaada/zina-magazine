"use server";

/**
 * src/actions/comments.ts
 *
 * Fonctionnalités côté serveur pour les commentaires avec Server Actions.
 * Évite le passage obligatoire par l'API Route et les fetch manuels.
 */

import { createServerSupabase } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

const BLOCKED_PATTERNS = [
  /https?:\/\//i,
  /\b(spam|casino|viagra|crypto|NFT)\b/i,
];

function isSpam(text: string): boolean {
  return BLOCKED_PATTERNS.some((p) => p.test(text));
}

export type CommentReturnData = {
  id: string;
  author_name: string;
  body: string;
  locale: string;
  created_at: string;
};

export type CommentActionState = {
  success?: boolean;
  message?: string;
  error?: string;
  comment?: CommentReturnData; // Typage strict pour la Data venant de Supabase
};

export async function addComment(
  prevState: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const articleId = (formData.get("articleId") as string)?.trim();
  const authorName = (formData.get("authorName") as string)?.trim();
  const commentBody = (formData.get("body") as string)?.trim();
  const localeRaw = formData.get("locale") as string;
  const locale = localeRaw === "ar" ? "ar" : "en";
  const articleSlug = (formData.get("articleSlug") as string | null)?.trim() || null;
  const articleTitle = (formData.get("articleTitle") as string | null)?.trim() || null;

  const t = (en: string, ar: string) => (locale === "ar" ? ar : en);

  if (!articleId || !authorName || !commentBody) {
    return {
      error: t(
        "articleId, authorName and body are required",
        "معرف المقال، اسم الكاتب والمحتوى مطلوبون",
      ),
    };
  }

  if (commentBody.length > 500) {
    return {
      error: t(
        "Comment exceeds 500 characters",
        "تجاوز التعليق الحد الأقصى 500 حرف",
      ),
    };
  }

  if (authorName.length > 80) {
    return {
      error: t(
        "Author name exceeds 80 characters",
        "تجاوز اسم الكاتب الحد الأقصى 80 حرف",
      ),
    };
  }

  if (isSpam(commentBody) || isSpam(authorName)) {
    // Message volontairement direct pour le spam
    return {
      error: t("Comment flagged as spam", "تم تمييز التعليق كبريد عشوائي"),
    };
  }

  const insertPayload: TablesInsert<"comments"> = {
    article_id: articleId,
    article_slug: articleSlug,
    article_title: articleTitle,
    author_name: authorName,
    body: commentBody,
    locale,
    is_approved: false, // En attente de modération par défaut
  };

  const supabase = createServerSupabase();

  try {
    const { error } = await supabase
      .from("comments")
      .insert(insertPayload);

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[comments action]", error);
      }
      return {
        error: t(
          "Unable to send comment. Please try again.",
          "تعذر إرسال التعليق. يرجى المحاولة مرة أخرى.",
        ),
      };
    }

    return {
      success: true,
      message: t(
        "Comment submitted. It will appear after approval.",
        "تم إرسال التعليق. سيظهر بعد الموافقة.",
      ),
    };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[comments action]", err);
    }
    return {
      error: t(
        "Unable to send comment. Please try again.",
        "تعذر إرسال التعليق. يرجى المحاولة مرة أخرى.",
      ),
    };
  }
}
