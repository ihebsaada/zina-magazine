/**
 * src/app/admin/page.tsx
 *
 * Dashboard admin — tableau de bord principal.
 * Protégé côté serveur : redirige vers /admin/login si non authentifié.
 *
 * Affiche :
 *  - Statistiques Supabase (likes, commentaires, abonnés newsletter)
 *  - Modération des commentaires
 *  - Liste récente des abonnés newsletter
 *  - Liens rapides vers Sanity Studio et les sections du site
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createServiceSupabase } from "@/lib/supabase/server";
import {
  Heart,
  MessageCircle,
  Mail,
  ExternalLink,
  LayoutDashboard,
  FileText,
  Tag,
} from "lucide-react";
import {
  CommentModerationList,
  type AdminComment,
} from "@/components/admin/CommentModerationList";

type NewsletterSubscriber = {
  id: string;
  email: string;
  locale: string;
  confirmed: boolean;
  created_at: string;
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

// ── Stats Supabase ────────────────────────────────────────────────────────────

async function getStats() {
  const supabase = createServiceSupabase();

  const [likesRes, approvedRes, pendingRes, newsletterRes] =
    await Promise.allSettled([
      supabase.from("likes").select("*", { count: "exact", head: true }),
      supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", true),
      supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", false),
      supabase.from("newsletter").select("*", { count: "exact", head: true }),
    ]);

  return {
    likes: likesRes.status === "fulfilled" ? (likesRes.value.count ?? 0) : 0,
    commentsApproved:
      approvedRes.status === "fulfilled" ? (approvedRes.value.count ?? 0) : 0,
    commentsPending:
      pendingRes.status === "fulfilled" ? (pendingRes.value.count ?? 0) : 0,
    newsletter:
      newsletterRes.status === "fulfilled"
        ? (newsletterRes.value.count ?? 0)
        : 0,
  };
}

async function getRecentComments(): Promise<AdminComment[]> {
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, article_id, article_slug, article_title, author_name, body, locale, is_approved, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[Admin] Failed to fetch comments:", error.message);
    return [];
  }

  return data ?? [];
}

async function getRecentSubscribers(): Promise<NewsletterSubscriber[]> {
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("newsletter")
    .select("id, email, locale, confirmed, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error(
      "[Admin] Failed to fetch newsletter subscribers:",
      error.message,
    );
    return [];
  }

  return data ?? [];
}

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  locale: string;
  is_read: boolean;
  created_at: string;
};

async function getRecentContactMessages(): Promise<ContactMessage[]> {
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, locale, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[Admin] Failed to fetch contact messages:", error.message);
    return [];
  }

  return data ?? [];
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [stats, recentComments, recentSubscribers, recentContactMessages] = await Promise.all([
    getStats(),
    getRecentComments(),
    getRecentSubscribers(),
    getRecentContactMessages(),
  ]);

  const unreadContactCount = recentContactMessages.filter((m) => !m.is_read).length;

  const statCards = [
    {
      icon: Heart,
      label: "Likes totaux",
      value: stats.likes,
      color: "#c9a96e",
    },
    {
      icon: Mail,
      label: "Messages contact",
      value: recentContactMessages.length,
      sublabel: unreadContactCount > 0 ? `${unreadContactCount} non lu${unreadContactCount > 1 ? "s" : ""}` : undefined,
      color: "#c9a96e",
    },
    {
      icon: MessageCircle,
      label: "Commentaires approuvés",
      value: stats.commentsApproved,
      sublabel:
        stats.commentsPending > 0
          ? `${stats.commentsPending} en attente`
          : undefined,
      color: "#7e9b8a",
    },
    {
      icon: Mail,
      label: "Abonnés newsletter",
      value: stats.newsletter,
      color: "#c47f8a",
    },
  ];

  const quickLinks = [
    {
      icon: LayoutDashboard,
      label: "Sanity Studio",
      href: "/studio",
      desc: "Gérer les articles, catégories, auteurs",
    },
    {
      icon: FileText,
      label: "Articles (EN)",
      href: "/en/articles",
      desc: "Voir la liste éditoriale",
    },
    {
      icon: FileText,
      label: "Articles (AR)",
      href: "/ar/articles",
      desc: "عرض قائمة المقالات",
    },
    {
      icon: Tag,
      label: "Catégories",
      href: "/en/categories",
      desc: "Voir toutes les catégories",
    },
  ];

  return (
    <div
      style={{
        background: "#f8f5f0",
        minHeight: "100dvh",
        fontFamily: "system-ui, sans-serif",
        color: "#100e0b",
      }}
    >
      {/* ── Topbar ────────────────────────────────────────────────────────── */}
      <header
        style={{
          background: "#100e0b",
          color: "#fdf9f5",
          padding: "0 2rem",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.125rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          ZINA <span style={{ color: "#c9a96e" }}>Admin</span>
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            fontSize: "0.8125rem",
          }}
        >
          <span style={{ color: "#9e9289" }}>{session.user?.email}</span>
          <Link
            href="/api/auth/signout"
            style={{
              color: "#c9a96e",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Déconnexion
          </Link>
        </div>
      </header>

      {/* ── Contenu ───────────────────────────────────────────────────────── */}
      <main
        style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}
      >
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          Tableau de bord
        </h1>

        <p
          style={{
            color: "#7a6e65",
            marginBottom: "2.5rem",
            fontSize: "0.9375rem",
          }}
        >
          Bienvenue, {session.user?.name ?? "Admin"}. Voici l&apos;état du
          magazine.
        </p>

        {/* Statistiques */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9e9289",
              marginBottom: "1rem",
            }}
          >
            Statistiques
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  style={{
                    background: "#fdf9f5",
                    border: "1px solid #d8d0c8",
                    padding: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: card.color + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color={card.color} />
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        lineHeight: 1,
                        margin: 0,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {card.value}
                    </p>

                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "#7a6e65",
                        margin: "0.25rem 0 0",
                      }}
                    >
                      {card.label}
                    </p>

                    {"sublabel" in card && card.sublabel && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#e8b84a",
                          fontWeight: 600,
                          margin: "0.125rem 0 0",
                        }}
                      >
                        {card.sublabel}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Modération des commentaires */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9e9289",
              marginBottom: "0.5rem",
            }}
          >
            Modération des commentaires
          </h2>

          <p
            style={{
              fontSize: "0.875rem",
              color: "#7a6e65",
              marginBottom: "1rem",
            }}
          >
            {stats.commentsPending > 0
              ? `${stats.commentsPending} commentaire${stats.commentsPending > 1 ? "s" : ""} en attente de validation.`
              : "Aucun commentaire en attente."}
          </p>

          <CommentModerationList comments={recentComments} />
        </section>

        {/* Abonnés newsletter */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9e9289",
              marginBottom: "0.5rem",
            }}
          >
            Abonnés newsletter
          </h2>

          <p
            style={{
              fontSize: "0.875rem",
              color: "#7a6e65",
              marginBottom: "1rem",
            }}
          >
            {recentSubscribers.length > 0
              ? `${recentSubscribers.length} dernier${recentSubscribers.length > 1 ? "s" : ""} abonné${recentSubscribers.length > 1 ? "s" : ""}.`
              : "Aucun abonné pour le moment."}
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {recentSubscribers.map((subscriber) => (
              <article
                key={subscriber.id}
                style={{
                  background: "#fdf9f5",
                  border: "1px solid #d8d0c8",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      margin: "0 0 0.25rem",
                    }}
                  >
                    {subscriber.email}
                  </p>

                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#7a6e65",
                      margin: 0,
                    }}
                  >
                    {formatDate(subscriber.created_at)} ·{" "}
                    {subscriber.locale.toUpperCase()}
                  </p>
                </div>

                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.25rem 0.5rem",
                    background: subscriber.confirmed ? "#7e9b8a" : "#e8b84a",
                    color: subscriber.confirmed ? "#fff" : "#100e0b",
                  }}
                >
                  {subscriber.confirmed ? "Confirmé" : "Non confirmé"}
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* Messages contact */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9e9289",
              marginBottom: "0.5rem",
            }}
          >
            Messages contact
          </h2>

          <p
            style={{
              fontSize: "0.875rem",
              color: "#7a6e65",
              marginBottom: "1rem",
            }}
          >
            {recentContactMessages.length === 0
              ? "Aucun message pour le moment."
              : unreadContactCount > 0
                ? `${unreadContactCount} message${unreadContactCount > 1 ? "s" : ""} non lu${unreadContactCount > 1 ? "s" : ""}.`
                : `${recentContactMessages.length} message${recentContactMessages.length > 1 ? "s" : ""} reçu${recentContactMessages.length > 1 ? "s" : ""}.`}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentContactMessages.map((msg) => (
              <article
                key={msg.id}
                style={{
                  background: msg.is_read ? "#fdf9f5" : "#fef9ee",
                  border: msg.is_read ? "1px solid #d8d0c8" : "1px solid #c9a96e",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9375rem", margin: "0 0 0.2rem" }}>
                      {msg.name}
                    </p>
                    <a
                      href={`mailto:${msg.email}`}
                      style={{ fontSize: "0.8125rem", color: "#c9a96e", textDecoration: "none" }}
                    >
                      {msg.email}
                    </a>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "0.25rem 0.5rem",
                        background: msg.locale === "ar" ? "#f0e5d0" : "#e8f0eb",
                        color: msg.locale === "ar" ? "#a07c45" : "#4a7a5a",
                      }}
                    >
                      {msg.locale.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "0.25rem 0.5rem",
                        background: msg.is_read ? "#e8e4df" : "#c9a96e",
                        color: msg.is_read ? "#7a6e65" : "#100e0b",
                      }}
                    >
                      {msg.is_read ? "Lu" : "Nouveau"}
                    </span>
                  </div>
                </div>

                {/* Subject */}
                {msg.subject && (
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2b2520", margin: 0 }}>
                    {msg.subject}
                  </p>
                )}

                {/* Message body */}
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#3e3630",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {msg.message}
                </p>

                {/* Footer */}
                <p style={{ fontSize: "0.75rem", color: "#9e9289", margin: 0 }}>
                  {formatDate(msg.created_at)}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Liens rapides */}
        <section>
          <h2
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9e9289",
              marginBottom: "1rem",
            }}
          >
            Liens rapides
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {quickLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith("/studio") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    background: "#fdf9f5",
                    border: "1px solid #d8d0c8",
                    padding: "1.25rem 1.5rem",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    transition: "border-color 200ms",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <Icon size={18} color="#c9a96e" />
                    <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                      {link.label}
                    </span>

                    {link.href.startsWith("/studio") && (
                      <ExternalLink
                        size={12}
                        color="#9e9289"
                        style={{ marginLeft: "auto" }}
                      />
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#7a6e65",
                      margin: 0,
                    }}
                  >
                    {link.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}