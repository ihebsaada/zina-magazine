/**
 * src/lib/supabase/server.ts
 *
 * Client Supabase dédié pour l'exécution côté serveur (Server Actions, React Server Components).
 * Instancie un nouveau client par requête pour éviter les fuites de session entre utilisateurs
 * et désactive la persistance locale de session non pertinente sur le backend.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false, // Essentiel côté serveur pour Supabase-js pur
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function createServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
