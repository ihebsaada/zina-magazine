import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Calcule publiquement le nombre de likes d'un article.
 * Conçu pour un appel direct depuis un Server Component (SSR).
 */
export async function getLikeCount(articleId: string): Promise<number> {
  const supabase = createServerSupabase();

  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("article_id", articleId);

  return count ?? 0;
}
