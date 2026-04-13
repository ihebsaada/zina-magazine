/**
 * lib/i18n.ts
 *
 * Source de vérité unique pour tout ce qui concerne l'internationalisation.
 * Importer depuis ici dans l'ensemble du projet (proxy, layouts, composants).
 */

// ─── Locales définies ─────────────────────────────────────────────────────────

export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Vérifie si une chaîne est une locale valide (type guard).
 * Utile pour narrower un `string` venant des params Next.js.
 */
export const isValidLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/**
 * Retourne `true` si la locale utilise une écriture droite-à-gauche.
 */
export const isRTL = (locale: Locale): boolean => locale === "ar";

/**
 * Retourne l'attribut HTML `dir` correspondant à la locale.
 */
export const getDir = (locale: Locale): "ltr" | "rtl" =>
  isRTL(locale) ? "rtl" : "ltr";

/**
 * Retourne le label affiché pour chaque locale (pour le switcher de langue).
 */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

/**
 * Retourne le code BCP-47 à passer à l'attribut `lang` de `<html>`.
 * Extensible si on ajoute des sous-locales (ex: fr-CA).
 */
export const getHtmlLang = (locale: Locale): string => locale;
