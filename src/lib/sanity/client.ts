/**
 * lib/sanity/client.ts
 *
 * Clients Sanity pour la lecture publique (viewer token) et l'écriture admin.
 * - `sanityClient`        : lecture seule (Server Components, ISR)
 * - `sanityPreviewClient` : preview drafts (Studio embarqué)
 *
 * Variables d'env requises dans .env.local :
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN_VIEWER   ← token Sanity rôle "Viewer"
 *   SANITY_API_TOKEN_EDITOR   ← token Sanity rôle "Editor" (preview / Studio)
 */
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset  = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-04-12'

// Client lecture publique — contenu publié uniquement
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_TOKEN_VIEWER, // ← corrigé (était NEXT_PUBLIC_SANITY_VIEWER_TOKEN)
  perspective: 'published',
})

// Client preview (Sanity Studio embarqué + draft preview)
export const sanityPreviewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN_EDITOR, // ← corrigé (était SANITY_API_TOKEN)
  perspective: 'previewDrafts',
})
