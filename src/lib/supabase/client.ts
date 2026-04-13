/**
 * lib/supabase/client.ts
 *
 * Clients Supabase pour deux contextes :
 * - `supabase` : client côté serveur (Server Components, Route Handlers)
 * - `supabaseBrowser` : client côté client (pour InteractionsUI si nécessaire)
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client principal (server-side + route handlers)
export const supabase = createClient<Database>(url, anonKey);

// Client browser exposé uniquement si besoin dans un "use client"
export function createBrowserClient() {
  return createClient<Database>(url, anonKey);
}
