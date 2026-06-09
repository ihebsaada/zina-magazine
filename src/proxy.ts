/**
 * src/proxy.ts
 *
 *  * Fichier proxy Next.js pour la protection /admin et la redirection i18n.
 * Combine deux responsabilités dans l'ordre :
 *
 *  1. Protection des routes /admin (NextAuth)
 *  2. Redirection i18n vers la locale préférée du visiteur
 *
 * Note : /studio est exclu du matcher — Sanity gère sa propre authentification.
 *  L'ordre est critique : la vérification d'authentification
 *     doit précéder la redirection locale.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { locales, defaultLocale, isValidLocale } from "@/lib/i18n";

// ── Helpers i18n ─────────────────────────────────────────────────────────────

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.trim() ?? "";
  return isValidLocale(preferred) ? preferred : defaultLocale;
}

// ── Proxy principal ──────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Protection /admin ────────────────────────────────────────────────
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    // La page de login est toujours accessible
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Non authentifié → rediriger vers la page de login
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ── 2. Redirection i18n ──────────────────────────────────────────────────
  // Si la pathname commence déjà par une locale valide, laisser passer
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Sinon, rediriger vers la locale préférée
  const locale = getPreferredLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

// ── Matcher ──────────────────────────────────────────────────────────

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|studio|api/auth).*)"],
// };
export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next/static|_next/image|studio(?:/|$)|.*\\..*).*)",
  ],
};