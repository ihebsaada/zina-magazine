"use server";

/**
 * src/actions/newsletter.ts
 *
 * Exemple de Server Action pour l'inscription à la newsletter.
 * Remplace progressivement les fetch(/api/newsletter).
 */

import { createServerSupabase } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Type de retour standardisé pour la gestion UI (succès / erreur)
export type ActionState = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function subscribeToNewsletter(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawEmail = formData.get("email") as string | null;
  const locale = (formData.get("locale") as string) === "ar" ? "ar" : "en";

  if (!rawEmail || typeof rawEmail !== "string") {
    return { error: "L'adresse email est requise." };
  }

  const normalizedEmail = rawEmail.trim().toLowerCase();

  if (!EMAIL_RE.test(normalizedEmail)) {
    return { error: "Adresse email invalide." };
  }

  const insertPayload: TablesInsert<"newsletter"> = {
    email: normalizedEmail,
    locale,
    confirmed: false,
  };

  // Instanciation sécurisée sur le serveur, fraîche d'exécution
  const supabase = createServerSupabase();

  // Insertion Base de Données
  const { error } = await supabase.from("newsletter").insert(insertPayload);

  if (error) {
    // 23505 est le code Supabase (Postgres) pour une duplication "unique"
    if (error.code === "23505") {
      return { success: true, message: "Vous êtes déjà inscrit !" };
    }
    return { error: "Une erreur technique est survenue." };
  }

  return { success: true, message: "Inscription réussie ! Merci." };
}
