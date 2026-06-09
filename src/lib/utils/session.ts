/**
 * src/lib/utils/session.ts
 *
 * Utilitaire pour générer et récupérer un identifiant de session unique par navigateur.
 * Utilisé pour identifier un utilisateur anonyme (ex: Likes) sans backend d'Auth.
 * Stocké dans un cookie (365 jours, sameSite lax) pour survivre aux navigations
 * et être lisible côté serveur si besoin.
 */
import Cookies from "js-cookie";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  const STORAGE_KEY = "ZINA_device_id";
  let sessionId = Cookies.get(STORAGE_KEY);

  if (!sessionId) {
    try {
      sessionId = crypto.randomUUID();
    } catch {
      sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    Cookies.set(STORAGE_KEY, sessionId, { expires: 365, sameSite: "lax" });
  }

  return sessionId;
}
