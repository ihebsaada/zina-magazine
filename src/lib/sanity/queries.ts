/**
 * lib/sanity/queries.ts
 *
 * Toutes les requêtes GROQ du magazine.
 * Convention : les fonctions retournent directly les résultats typés.
 */
import { sanityClient } from "./client";
import { urlFor } from "./image";
import type { Locale } from "@/lib/i18n";
import type { Category } from "@/types/magazine";

// ─── Types Sanity (documents bruts) ──────────────────────────────────────────

export interface SanityArticle {
  _id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  coverImage: {
    asset: { _ref: string };
    alt_en?: string;
    alt_ar?: string;
  };
  category: {
    _id: string;
    slug: string;
    name_en: string;
    name_ar: string;
    color?: string;
  };
  author: {
    _id: string;
    name_en: string;
    name_ar: string;
    role_en?: string;
    role_ar?: string;
    bio_en?: string;
    bio_ar?: string;
    avatar?: { asset: { _ref: string } };
  };
  publishedAt: string;
  readingTime?: number;
  featured?: boolean;
  isExclusive?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_en?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_ar?: any[];
}

export interface SanityCategory {
  _id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  color?: string;
  description_en?: string;
  description_ar?: string;
  subcategories?: SanityCategory[];
}

// ─── Fragments GROQ réutilisables ─────────────────────────────────────────────

const CATEGORY_FIELDS = `
  _id,
  "slug": slug.current,
  name_en,
  name_ar,
  color
`;

const AUTHOR_FIELDS = `
  _id,
  name_en,
  name_ar,
  role_en,
  role_ar,
  bio_en,
  bio_ar,
  avatar
`;

const ARTICLE_CARD_FIELDS = `
  _id,
  "slug": slug.current,
  title_en,
  title_ar,
  excerpt_en,
  excerpt_ar,
  coverImage,
  publishedAt,
  readingTime,
  featured,
  isExclusive,
  category-> { ${CATEGORY_FIELDS} },
  author-> { ${AUTHOR_FIELDS} }
`;

const ARTICLE_FULL_FIELDS = `
  ${ARTICLE_CARD_FIELDS},
  body_en,
  body_ar,
  "tags": tags[]->{ _id, "slug": slug.current, name_en, name_ar }
`;

// ─── Résolution par locale ─────────────────────────────────────────────────────

export function resolveArticle(raw: SanityArticle, locale: Locale) {
  const isAr = locale === "ar";
  return {
    _id: raw._id,
    slug: raw.slug,
    title: isAr ? raw.title_ar : raw.title_en,
    excerpt: isAr ? raw.excerpt_ar : raw.excerpt_en,
    coverImage: raw.coverImage?.asset
      ? urlFor(raw.coverImage).width(1200).height(675).fit("crop").url()
      : "",
    coverImageAlt: isAr
      ? (raw.coverImage?.alt_ar ?? raw.coverImage?.alt_en ?? "")
      : (raw.coverImage?.alt_en ?? raw.coverImage?.alt_ar ?? ""),
    category: {
      _id: raw.category._id,
      slug: raw.category.slug,
      title: isAr ? raw.category.name_ar : raw.category.name_en,
      color: raw.category.color,
    },
    author: {
      _id: raw.author._id,
      name: isAr ? raw.author.name_ar : raw.author.name_en,
      role: isAr ? raw.author.role_ar : raw.author.role_en,
      bio: isAr ? raw.author.bio_ar : raw.author.bio_en,
      avatar: raw.author.avatar?.asset
        ? urlFor(raw.author.avatar).width(200).height(200).fit("crop").url()
        : undefined,
    },
    publishedAt: raw.publishedAt,
    readingTime: raw.readingTime ?? 5,
    featured: raw.featured ?? false,
    isExclusive: raw.isExclusive ?? false,
    body: isAr ? (raw.body_ar ?? []) : (raw.body_en ?? []),
  };
}

export interface ResolvedCategory extends Category {
  description?: string;
  subcategories: ResolvedCategory[];
}

export function resolveCategory(raw: SanityCategory, locale: Locale): ResolvedCategory {
  return {
    _id: raw._id,
    slug: raw.slug,
    title: locale === "ar" ? raw.name_ar : raw.name_en,
    description: locale === "ar" ? raw.description_ar : raw.description_en,
    color: raw.color,
    subcategories: raw.subcategories
      ? raw.subcategories.map((sub) => resolveCategory(sub, locale))
      : [],
  };
}

// ─── Queries publiques ────────────────────────────────────────────────────────

/** Tous les articles triés par date desc */
export async function getAllArticles(locale: Locale) {
  const query = `*[_type == "article"] | order(publishedAt desc) {
    ${ARTICLE_CARD_FIELDS}
  }`;
  const raw: SanityArticle[] = await sanityClient.fetch(
    query,
    {},
    { next: { revalidate: 60 } },
  );
  return raw.map((a) => resolveArticle(a, locale));
}

/** Article à la une (premier article featured, fallback sur le plus récent) */
export async function getFeaturedArticle(locale: Locale) {
  const query = `*[_type == "article" && featured == true] | order(publishedAt desc) [0] {
    ${ARTICLE_CARD_FIELDS}
  }`;
  const raw: SanityArticle | null = await sanityClient.fetch(
    query,
    {},
    { next: { revalidate: 60 } },
  );
  if (raw) return resolveArticle(raw, locale);

  // Fallback : article le plus récent
  const fallbackQuery = `*[_type == "article"] | order(publishedAt desc) [0] { ${ARTICLE_CARD_FIELDS} }`;
  const fallback: SanityArticle | null = await sanityClient.fetch(
    fallbackQuery,
    {},
    { next: { revalidate: 60 } },
  );
  return fallback ? resolveArticle(fallback, locale) : null;
}

/**
 * 4 most recent non-featured articles.
 * Filters: (1) featured != true — structural guard, independent of the document action.
 *          (2) _id != $excludeId — handles the fallback case where the hero has no flag.
 */
export async function getLatestArticles(
  locale: Locale,
  excludeId?: string,
  limit = 4,
) {
  const idCondition = excludeId ? `&& _id != $excludeId` : "";
  const query = `*[_type == "article" && featured != true ${idCondition}] | order(publishedAt desc) [0...$limit] {
    ${ARTICLE_CARD_FIELDS}
  }`;
  const raw: SanityArticle[] = await sanityClient.fetch(
    query,
    { excludeId: excludeId ?? "", limit },
    { next: { revalidate: 60 } },
  );
  return raw.map((a) => resolveArticle(a, locale));
}

/** Un article par slug */
export async function getArticleBySlug(slug: string, locale: Locale) {
  const query = `*[_type == "article" && slug.current == $slug][0] {
    ${ARTICLE_FULL_FIELDS}
  }`;
  const raw: SanityArticle | null = await sanityClient.fetch(
    query,
    { slug },
    { next: { revalidate: 60 } },
  );
  if (!raw) return null;
  return resolveArticle(raw, locale);
}

/**
 * Articles by category slug.
 * Matches articles directly assigned to the slug OR assigned to any
 * subcategory whose parent slug matches — so homepage sections that
 * query a top-level slug (e.g. "culture") still find articles that
 * editors assigned to a subcategory (e.g. "agenda-culture").
 */
export async function getArticlesByCategory(
  categorySlug: string,
  locale: Locale,
) {
  const query = `*[
    _type == "article" &&
    (
      category->slug.current == $categorySlug ||
      category->parent->slug.current == $categorySlug
    )
  ] | order(publishedAt desc) {
    ${ARTICLE_CARD_FIELDS}
  }`;
  const raw: SanityArticle[] = await sanityClient.fetch(
    query,
    { categorySlug },
    { next: { revalidate: 60 } },
  );
  return raw.map((a) => resolveArticle(a, locale));
}

/** Toutes les catégories */
export async function getAllCategories(locale: Locale) {
  const query = `*[_type == "category"] | order(name_en asc) {
    ${CATEGORY_FIELDS},
    description_en,
    description_ar
  }`;
  const raw: SanityCategory[] = await sanityClient.fetch(
    query,
    {},
    { next: { revalidate: 300 } },
  );
  return raw.map((c) => resolveCategory(c, locale));
}

/** Les catégories principales avec leurs sous-catégories imbriquées */
export async function getMainCategoriesWithSubs(locale: Locale) {
  const query = `*[_type == "category" && !defined(parent)] | order(name_en asc) {
    ${CATEGORY_FIELDS},
    "subcategories": *[_type == "category" && parent._ref == ^._id] | order(name_en asc) {
      ${CATEGORY_FIELDS}
    }
  }`;
  
  const raw: SanityCategory[] = await sanityClient.fetch(
    query,
    {},
    { next: { revalidate: 300 } },
  );

  return raw.map((c) => resolveCategory(c, locale));
}

/** Toutes les catégories avec leur compte d'articles intégré (Résout le N+1) */
export async function getAllCategoriesWithCount(locale: Locale) {
  const query = `*[_type == "category"] | order(name_en asc) {
    ${CATEGORY_FIELDS},
    description_en,
    description_ar,
    "articleCount": count(*[_type == "article" && references(^._id)])
  }`;

  const raw: (SanityCategory & { articleCount: number })[] =
    await sanityClient.fetch(query, {}, { next: { revalidate: 300 } });

  return raw.map((c) => ({
    ...resolveCategory(c, locale),
    articleCount: c.articleCount ?? 0,
  }));
}

/** Slugs de tous les articles (pour generateStaticParams) */
export async function getAllArticleSlugs(): Promise<string[]> {
  const query = `*[_type == "article"]{ "slug": slug.current }.slug`;
  return sanityClient.fetch(query);
}

/** Slugs de toutes les catégories (pour generateStaticParams) */
export async function getAllCategorySlugs(): Promise<string[]> {
  const query = `*[_type == "category"]{ "slug": slug.current }.slug`;
  return sanityClient.fetch(query);
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface HomepageCategoryHighlight {
  slug: string;
  title: string; // resolved for the current locale
}

/**
 * Fetches the siteSettings singleton and returns the configured homepage
 * category highlight, resolved to the current locale.
 *
 * Returns `null` if:
 *  - the siteSettings document has never been published
 *  - the homepageCategoryHighlight field is empty
 *
 * The caller is responsible for applying a fallback slug.
 */
export async function getHomepageSettings(
  locale: Locale,
): Promise<HomepageCategoryHighlight | null> {
  const query = `*[_type == "siteSettings" && _id == "siteSettings"][0] {
    "highlightCategory": homepageCategoryHighlight-> {
      "slug": slug.current,
      name_en,
      name_ar
    }
  }`;

  const raw = await sanityClient.fetch<{
    highlightCategory: {
      slug: string;
      name_en: string;
      name_ar: string;
    } | null;
  } | null>(query, {}, { next: { revalidate: 300 } });

  if (!raw?.highlightCategory) return null;

  return {
    slug: raw.highlightCategory.slug,
    title:
      locale === "ar"
        ? raw.highlightCategory.name_ar
        : raw.highlightCategory.name_en,
  };
}

/**
 * Returns the ordered list of top-level categories for the site header,
 * each with their subcategories resolved.
 *
 * Source: siteSettings.headerCategories (ordered array of references).
 *
 * Fallback: if the array is empty or siteSettings has never been published,
 * falls back to getMainCategoriesWithSubs() — alphabetical, all categories.
 * This ensures the header always renders something meaningful.
 */
export async function getHeaderCategories(locale: Locale) {
  const query = `*[_type == "siteSettings" && _id == "siteSettings"][0] {
    "headerCategories": headerCategories[]->{
      ${CATEGORY_FIELDS},
      "subcategories": *[_type == "category" && parent._ref == ^._id] | order(name_en asc) {
        ${CATEGORY_FIELDS}
      }
    }
  }`;

  const raw = await sanityClient.fetch<{
    headerCategories: (SanityCategory & {
      subcategories: SanityCategory[];
    })[] | null;
  } | null>(query, {}, { next: { revalidate: 300 } });

  // If the editor has configured categories, use them in the stored order
  if (raw?.headerCategories && raw.headerCategories.length > 0) {
    return raw.headerCategories.map((c) => resolveCategory(c, locale));
  }

  // Fallback: all main categories alphabetically
  return getMainCategoriesWithSubs(locale);
}

/**
 * Full-text article search across title and excerpt for the given locale.
 * Uses GROQ string matching (case-insensitive contains) — no additional plugin needed.
 */
export async function searchArticles(query: string, locale: Locale) {
  if (!query.trim()) return [];

  // Match against both locales so results are locale-aware but the DB holds both.
  const groq = `*[
    _type == "article" &&
    (
      title_en match $pattern ||
      title_ar match $pattern ||
      excerpt_en match $pattern ||
      excerpt_ar match $pattern
    )
  ] | order(publishedAt desc) [0...30] {
    ${ARTICLE_CARD_FIELDS}
  }`;

  const raw: SanityArticle[] = await sanityClient.fetch(
    groq,
    { pattern: `*${query}*` },
    { next: { revalidate: 30 } },
  );
  return raw.map((a) => resolveArticle(a, locale));
}
