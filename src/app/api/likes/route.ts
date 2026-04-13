/**
 * api/likes/route.ts
 *
 * GET    ?articleId=xxx&sessionId=yyy → nombre de likes + si la session a liké
 * POST   {articleId, sessionId} → ajouter un like
 * DELETE {articleId, sessionId} → retirer un like
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import type { TablesInsert } from '@/lib/supabase/types'

type LikeBody = {
  articleId?: string
  sessionId?: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const articleId = searchParams.get('articleId')
  const sessionId = searchParams.get('sessionId')

  if (!articleId) {
    return NextResponse.json({ error: 'articleId is required' }, { status: 400 })
  }

  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', articleId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let isLiked = false

  if (sessionId) {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('session_id', sessionId)
      .maybeSingle()

    isLiked = !!data
  }

  return NextResponse.json({ count: count ?? 0, isLiked })
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LikeBody
  const articleId = body.articleId?.trim()
  const sessionId = body.sessionId?.trim()

  if (!articleId || !sessionId) {
    return NextResponse.json(
      { error: 'articleId and sessionId are required' },
      { status: 400 }
    )
  }

  const insertPayload: TablesInsert<'likes'> = {
    article_id: articleId,
    session_id: sessionId,
  }

  const { error } = await supabase
    .from('likes')
    .insert(insertPayload)

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already liked' }, { status: 409 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const body = (await request.json()) as LikeBody
  const articleId = body.articleId?.trim()
  const sessionId = body.sessionId?.trim()

  if (!articleId || !sessionId) {
    return NextResponse.json(
      { error: 'articleId and sessionId are required' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('article_id', articleId)
    .eq('session_id', sessionId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}