"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, Trash2, X } from "lucide-react";

export type AdminComment = {
  id: string;
  article_id: string;
  article_slug: string | null;
  article_title: string | null;
  author_name: string;
  body: string;
  locale: string;
  is_approved: boolean;
  created_at: string;
};

type CommentModerationListProps = {
  comments: AdminComment[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommentModerationList({ comments }: CommentModerationListProps) {
  const router = useRouter();
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function patchComment(id: string, is_approved: boolean) {
    setActionId(id);
    setError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_approved }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error_en?: string };
        setError(data.error_en ?? "Action failed");
        return;
      }

      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setActionId(null);
    }
  }

  async function deleteComment(id: string) {
    if (!window.confirm("Supprimer ce commentaire définitivement ?")) return;

    setActionId(id);
    setError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error_en?: string };
        setError(data.error_en ?? "Delete failed");
        return;
      }

      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setActionId(null);
    }
  }

  if (comments.length === 0) {
    return (
      <p style={{ fontSize: "0.875rem", color: "#7a6e65", margin: 0 }}>
        Aucun commentaire pour le moment.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {error && (
        <p
          style={{
            fontSize: "0.875rem",
            color: "#c47f8a",
            padding: "0.75rem",
            background: "#f2e5e7",
            borderLeft: "3px solid #c47f8a",
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      {comments.map((comment) => {
        const isPending = !comment.is_approved;
        const busy = actionId === comment.id;

        return (
          <article
            key={comment.id}
            style={{
              background: isPending ? "#fff8ed" : "#fdf9f5",
              border: isPending
                ? "2px solid #e8b84a"
                : "1px solid #d8d0c8",
              padding: "1rem 1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.5rem 1rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.25rem 0.5rem",
                  background: isPending ? "#e8b84a" : "#7e9b8a",
                  color: isPending ? "#100e0b" : "#fff",
                }}
              >
                {isPending ? "En attente" : "Approuvé"}
              </span>
              <span style={{ fontSize: "0.8125rem", color: "#7a6e65" }}>
                {formatDate(comment.created_at)}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#9e9289",
                  textTransform: "uppercase",
                }}
              >
                {comment.locale}
              </span>
            </div>

            <p
              style={{
                fontWeight: 600,
                fontSize: "0.9375rem",
                margin: "0 0 0.25rem",
              }}
            >
              {comment.author_name}
            </p>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "#7a6e65",
                margin: "0 0 0.75rem",
              }}
            >
              {comment.article_title ? (
                <>
                  Article :{" "}
                  {comment.article_slug ? (
                    <a
                      href={`/${comment.locale === "ar" ? "ar" : "en"}/articles/${comment.article_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#5a7a6a",
                        fontWeight: 600,
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      {comment.article_title}
                    </a>
                  ) : (
                    <span style={{ fontWeight: 600 }}>{comment.article_title}</span>
                  )}
                </>
              ) : (
                <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#9e9289" }}>
                  article_id: {comment.article_id}
                </span>
              )}
            </p>
            <p
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.5,
                margin: "0 0 1rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {comment.body}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {isPending && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => patchComment(comment.id, true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.5rem 0.875rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    background: "#7e9b8a",
                    color: "#fff",
                    border: "none",
                    cursor: busy ? "not-allowed" : "pointer",
                    opacity: busy ? 0.7 : 1,
                  }}
                >
                  {busy ? (
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <Check size={14} />
                  )}
                  Approuver
                </button>
              )}

              {!isPending && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => patchComment(comment.id, false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.5rem 0.875rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    background: "#fff",
                    color: "#7a6e65",
                    border: "1px solid #d8d0c8",
                    cursor: busy ? "not-allowed" : "pointer",
                    opacity: busy ? 0.7 : 1,
                  }}
                >
                  {busy ? (
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <X size={14} />
                  )}
                  Désapprouver
                </button>
              )}

              <button
                type="button"
                disabled={busy}
                onClick={() => deleteComment(comment.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 0.875rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  background: "#fff",
                  color: "#c47f8a",
                  border: "1px solid #e8c4c9",
                  cursor: busy ? "not-allowed" : "pointer",
                  opacity: busy ? 0.7 : 1,
                }}
              >
                {busy ? (
                  <Loader2
                    size={14}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Trash2 size={14} />
                )}
                Supprimer
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
