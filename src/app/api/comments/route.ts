/**
 * api/comments/route.ts
 *
 * GET    ?articleId=xxx → liste des commentaires approuvés de la locale courante
 * POST   {articleId, authorName, body} → ajouter un commentaire
 * DELETE {id} → supprimer un commentaire (admin uniquement)
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase/client";
import type { TablesInsert } from "@/lib/supabase/types";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mots-clés indésirables (modération basique côté serveur)
const BLOCKED_PATTERNS = [
  /https?:\/\//i,
  /\b(spam|casino|viagra|crypto|NFT)\b/i,
];

function isSpam(text: string): boolean {
  return BLOCKED_PATTERNS.some((p) => p.test(text));
}

function normalizeLocale(value: string | null): "en" | "ar" {
  return value === "ar" ? "ar" : "en";
}

type CreateCommentBody = {
  articleId?: string;
  authorName?: string;
  body?: string;
};

type DeleteCommentBody = {
  id?: string;
};

export async function GET(request: NextRequest) {
  const locale = normalizeLocale(request.headers.get("x-locale"));
  const t = (en: string, ar: string) => (locale === "ar" ? ar : en);

  const { searchParams } = request.nextUrl;
  const articleId = searchParams.get("articleId");

  if (!articleId) {
    return NextResponse.json(
      { error: t("articleId is required", "معرف المقال مطلوب") },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("comments")
    .select("id, author_name, body, locale, created_at")
    .eq("article_id", articleId)
    .eq("is_approved", true)
    .eq("locale", locale)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(request: NextRequest) {
  const locale = normalizeLocale(request.headers.get("x-locale"));
  const t = (en: string, ar: string) => (locale === "ar" ? ar : en);

  const body = (await request.json()) as CreateCommentBody;
  const articleId = body.articleId?.trim();
  const authorName = body.authorName?.trim();
  const commentBody = body.body?.trim();

  if (!articleId || !authorName || !commentBody) {
    return NextResponse.json(
      {
        error: t(
          "articleId, authorName and body are required",
          "معرف المقال، اسم الكاتب والمحتوى مطلوبون",
        ),
      },
      { status: 400 },
    );
  }

  if (commentBody.length > 500) {
    return NextResponse.json(
      {
        error: t(
          "Comment exceeds 500 characters",
          "تجاوز التعليق الحد الأقصى 500 حرف",
        ),
      },
      { status: 422 },
    );
  }

  if (authorName.length > 80) {
    return NextResponse.json(
      {
        error: t(
          "Author name exceeds 80 characters",
          "تجاوز اسم الكاتب الحد الأقصى 80 حرف",
        ),
      },
      { status: 422 },
    );
  }

  if (isSpam(commentBody) || isSpam(authorName)) {
    return NextResponse.json(
      { error: t("Comment flagged as spam", "تم تمييز التعليق كبريد عشوائي") },
      { status: 403 },
    );
  }

  const insertPayload: TablesInsert<"comments"> = {
    article_id: articleId,
    author_name: authorName,
    body: commentBody,
    locale,
    is_approved: true,
  };

  const { data, error } = await supabase
    .from("comments")
    .insert(insertPayload)
    .select("id, author_name, body, locale, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { error_en: "Unauthorized", error_ar: "غير مصرح" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as DeleteCommentBody;
  const id = body.id?.trim();

  if (!id) {
    return NextResponse.json(
      { error_en: "Comment ID required", error_ar: "معرف التعليق مطلوب" },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("comments").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { error_en: error.message, error_ar: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
