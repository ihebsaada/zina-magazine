/**
 * src/app/admin/page.tsx
 *
 * Dashboard admin — tableau de bord principal.
 * Protégé côté serveur : redirige vers /admin/login si non authentifié.
 *
 * Affiche :
 *  - Statistiques Supabase (likes, commentaires, abonnés newsletter)
 *  - Liens rapides vers Sanity Studio et les sections du site
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase/client";
import {
  Heart,
  MessageCircle,
  Mail,
  ExternalLink,
  LayoutDashboard,
  FileText,
  Tag,
} from "lucide-react";

// ── Stats Supabase ────────────────────────────────────────────────────────────

async function getStats() {
  const [likesRes, commentsRes, newsletterRes] = await Promise.allSettled([
    supabase.from("likes").select("*", { count: "exact", head: true }),
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", true),
    supabase.from("newsletter").select("*", { count: "exact", head: true }),
  ]);

  return {
    likes: likesRes.status === "fulfilled" ? (likesRes.value.count ?? 0) : 0,
    comments:
      commentsRes.status === "fulfilled" ? (commentsRes.value.count ?? 0) : 0,
    newsletter:
      newsletterRes.status === "fulfilled"
        ? (newsletterRes.value.count ?? 0)
        : 0,
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  // Protection côté serveur
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const stats = await getStats();

  const statCards = [
    {
      icon: Heart,
      label: "Likes totaux",
      value: stats.likes,
      color: "#c9a96e",
    },
    {
      icon: MessageCircle,
      label: "Commentaires",
      value: stats.comments,
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
    <html lang="fr">
      <body
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
            Xmedia <span style={{ color: "#c9a96e" }}>Admin</span>
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
                    </div>
                  </div>
                );
              })}
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
                    target={
                      link.href.startsWith("/studio") ? "_blank" : undefined
                    }
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
      </body>
    </html>
  );
}
