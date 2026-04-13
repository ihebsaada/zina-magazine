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
  success?: boolean;
  error?: string;
};

export async function toggleLike(
  articleId: string,
  sessionId: string,
  action: "like" | "unlike",
): Promise<LikeActionState> {
  const cleanArticleId = articleId.trim();
  const cleanSessionId = sessionId.trim();

  // Contrôle strict pour éviter l'insertion de déchets ou de sessionId falsifiés
  if (
    !cleanArticleId ||
    !cleanSessionId ||
    cleanSessionId.length < 5 ||
    cleanSessionId.length > 100
  ) {
    return { error: "Invalid articleId or sessionId" };
  }

  // Client isolé et sécurisé pour l'exécution Serveur
  const supabase = createServerSupabase();

  if (action === "like") {
    const insertPayload: TablesInsert<"likes"> = {
      article_id: cleanArticleId,
      session_id: cleanSessionId,
    };

    const { error } = await supabase.from("likes").insert(insertPayload);

    if (error) {
      // Si l'utilisateur clique frénétiquement et que l'insert existe : exception tolérée
      if (error.code === "23505") {
        return { success: true };
      }
      return { error: error.message };
    }

    return { success: true };
  } else {
    // Suppression
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("article_id", cleanArticleId)
      .eq("session_id", cleanSessionId);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  }
}
