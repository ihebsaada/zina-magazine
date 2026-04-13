import { createServerSupabase } from './server'
import type { CommentReturnData } from '@/actions/comments'

/**
 * Récupère publiquement tous les commentaires d'un article.
 * Conçu pour un appel direct depuis un Server Component (SSR).
 */
export async function getComments(articleId: string): Promise<CommentReturnData[]> {
  const supabase = createServerSupabase()
  
  const { data } = await supabase
    .from('comments')
    .select('id, author_name, body, locale, created_at')
    .eq('article_id', articleId)
    .order('created_at', { ascending: false })

  return data ?? []
}

/**
 * Calcule publiquement le nombre de likes d'un article.
 * Conçu pour un appel direct depuis un Server Component (SSR).
 */
export async function getLikeCount(articleId: string): Promise<number> {
  const supabase = createServerSupabase()
  
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', articleId)

  return count ?? 0
}
