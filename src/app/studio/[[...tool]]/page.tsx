/**
 * src/app/studio/[[...tool]]/page.tsx
 *
 * Sanity Studio embarqué dans Next.js App Router.
 *
 * ⚠️  Cette page est EXCLUE du middleware i18n (voir src/proxy.ts matcher).
 *     Elle est accessible à /studio sans préfixe de locale.
 *
 * En production : protéger avec NextAuth (à implémenter dans middleware.ts).
 * Pour l'instant la route est publique — à sécuriser avant déploiement.
 *
 * Ref: next-sanity docs — https://www.sanity.io/docs/nextjs-app-router
 */
import { Studio } from "./Studio";

// Désactiver le SSR pour le Studio (il est 100% client-side)
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}
