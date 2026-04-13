/**
 * lib/dictionaries.ts
 *
 * Chargement des dictionnaires de traduction côté serveur uniquement.
 * Typage strict depuis le JSON anglais (source de vérité structurelle).
 */
import 'server-only'

import type { Locale } from '@/lib/i18n'
import type enDict from '@/dictionaries/en.json'

// Le type Dictionary est inféré depuis la structure du JSON anglais
export type Dictionary = typeof enDict

// Chargement dynamique — les JSON ne sont envoyés au client que si utilisés
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () =>
    import('@/dictionaries/en.json').then(
      (m) => m.default as unknown as Dictionary
    ),
  ar: () =>
    import('@/dictionaries/ar.json').then(
      (m) => m.default as unknown as Dictionary
    ),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]()
