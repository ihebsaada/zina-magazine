/**
 * src/app/api/auth/[...nextauth]/route.ts
 *
 * NextAuth v4 — Provider Email (magic link via Nodemailer) + Credentials (admin local)
 *
 * Pour l'instant : Credentials uniquement avec identifiants en .env.local
 * (ADMIN_EMAIL + ADMIN_PASSWORD) — suffisant pour un admin solo.
 *
 * Étapes pour passer en production :
 *   1. Ajouter ADMIN_EMAIL et ADMIN_PASSWORD dans .env.local
 *   2. Remplacer Credentials par Email provider + SMTP réel si multi-admin
 *   3. Protéger /admin et /studio dans middleware.ts
 */
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // ── Providers ───────────────────────────────────────────────────────────────
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          console.error(
            "[NextAuth] ADMIN_EMAIL or ADMIN_PASSWORD not set in .env.local",
          );
          return null;
        }

        if (
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          return {
            id: "1",
            name: "Admin",
            email: adminEmail,
            role: "admin",
          };
        }
        return null;
      },
    }),
  ],

  // ── Session ─────────────────────────────────────────────────────────────────
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 heures
  },

  // ── JWT callbacks (pour propager le rôle) ───────────────────────────────────
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  // ── Pages personnalisées ────────────────────────────────────────────────────
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  // ── Secret ──────────────────────────────────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
