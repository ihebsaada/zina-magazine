import { createServerSupabase } from "@/lib/supabase/server";
import type { CommentReturnData } from "@/features/comments/actions";

/**
 * Récupère publiquement tous les commentaires d'un article.
 * Conçu pour un appel direct depuis un Server Component (SSR).
 */
export async function getComments(
  articleId: string,
): Promise<CommentReturnData[]> {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("comments")
    .select("id, author_name, body, locale, created_at")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });

  return data ?? [];
}
