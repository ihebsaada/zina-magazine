"use server";

/**
 * src/actions/likes.ts
 *
 * Fonctionnalité de bascule (Like / Unlike) côté serveur via Server Actions.
 * Ne dépend plus de l'API Route Route Handler.
 */

import { createServerSupabase } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type LikeActionState = {
  success: boolean;
  isLiked: boolean;
  count?: number;
  error?: string;
};

export async function toggleLike(
  articleId: string,
  sessionId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  action?: "like" | "unlike",
): Promise<LikeActionState> {
  const cleanArticleId = articleId?.trim();
  const cleanSessionId = sessionId?.trim();

  // Contrôle strict pour éviter l'insertion de déchets ou de sessionId falsifiés
  if (
    !cleanArticleId ||
    !cleanSessionId ||
    cleanSessionId.length < 5 ||
    cleanSessionId.length > 100
  ) {
    return {
      success: false,
      isLiked: false,
      error: "Invalid articleId or sessionId",
    };
  }

  // Client isolé et sécurisé pour l'exécution Serveur
  const supabase = createServerSupabase();

  try {
    // Check if the like already exists in the database
    const { data: existingLike, error: checkError } = await supabase
      .from("likes")
      .select("id")
      .eq("article_id", cleanArticleId)
      .eq("session_id", cleanSessionId)
      .maybeSingle();

    if (checkError) {
      if (process.env.NODE_ENV === "development") {
        console.error("[likes action]", checkError);
      }
      return {
        success: false,
        isLiked: false,
        error: checkError.message,
      };
    }

    let nextIsLiked = false;

    if (existingLike) {
      // Already liked -> delete it
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("article_id", cleanArticleId)
        .eq("session_id", cleanSessionId);

      if (deleteError) {
        if (process.env.NODE_ENV === "development") {
          console.error("[likes action]", deleteError);
        }
        return {
          success: false,
          isLiked: true,
          error: deleteError.message,
        };
      }
      nextIsLiked = false;
    } else {
      // Not liked -> insert it
      const insertPayload: TablesInsert<"likes"> = {
        article_id: cleanArticleId,
        session_id: cleanSessionId,
      };

      const { error: insertError } = await supabase
        .from("likes")
        .insert(insertPayload);

      if (insertError) {
        if (process.env.NODE_ENV === "development") {
          console.error("[likes action]", insertError);
        }
        // If unique constraint violation, count as successfully liked
        if (insertError.code === "23505") {
          nextIsLiked = true;
        } else {
          return {
            success: false,
            isLiked: false,
            error: insertError.message,
          };
        }
      } else {
        nextIsLiked = true;
      }
    }

    // Retrieve the exact updated count of likes to keep client UI in sync
    const { count, error: countError } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("article_id", cleanArticleId);

    if (countError) {
      if (process.env.NODE_ENV === "development") {
        console.error("[likes action]", countError);
      }
      return {
        success: true,
        isLiked: nextIsLiked,
      };
    }

    return {
      success: true,
      isLiked: nextIsLiked,
      count: count ?? 0,
    };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[likes action]", err);
    }
    const errMessage = err instanceof Error ? err.message : "An unexpected error occurred";
    return {
      success: false,
      isLiked: false,
      error: errMessage,
    };
  }
}
