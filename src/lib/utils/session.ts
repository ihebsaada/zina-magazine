/**
 * src/lib/utils/session.ts
 *
 * Utilitaire pour générer et récupérer un identifiant de session unique par navigateur.
 * Utilisé pour identifier un utilisateur anonyme (ex: Likes) sans backend d'Auth.
 */

export function getOrCreateSessionId(): string {
  // Sécurité : ne jamais s'exécuter côté serveur (Next.js SSR)
  if (typeof window === "undefined") {
    return "";
  }

  const STORAGE_KEY = "xmedia_device_id";
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    // Génération robuste sans dépendre exclusivement de crypto (au cas où non-HTTPS)
    try {
      sessionId = crypto.randomUUID();
    } catch {
      sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}
