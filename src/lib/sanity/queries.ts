/**
 * lib/sanity/queries.ts
 *
 * Toutes les requêtes GROQ du magazine.
 * Convention : les fonctions retournent directly les résultats typés.
 */
import { sanityClient } from './client'
import { urlFor } from './image'
import type { Locale } from '@/lib/i18n'

// ─── Types Sanity (documents bruts) ──────────────────────────────────────────

export interface SanityArticle {
  _id: string
  slug: string
  title_en: string
  title_ar: string
  excerpt_en: string
  excerpt_ar: string
  coverImage: {
    asset: { _ref: string }
    alt_en?: string
    alt_ar?: string
  }
  category: {
    _id: string
    slug: string
    name_en: string
    name_ar: string
    color?: string
  }
  author: {
    _id: string
    name_en: string
    name_ar: string
    role_en?: string
    role_ar?: string
    bio_en?: string
    bio_ar?: string
    avatar?: { asset: { _ref: string } }
  }
  publishedAt: string
  readingTime?: number
  featured?: boolean
  isExclusive?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_en?: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_ar?: any[]
}

export interface SanityCategory {
  _id: string
  slug: string
  name_en: string
  name_ar: string
  color?: string
  description_en?: string
  description_ar?: string
}

// ─── Fragments GROQ réutilisables ─────────────────────────────────────────────

const CATEGORY_FIELDS = `
  _id,
  "slug": slug.current,
  name_en,
  name_ar,
  color
`

const AUTHOR_FIELDS = `
  _id,
  name_en,
  name_ar,
  role_en,
  role_ar,
  bio_en,
  bio_ar,
  avatar
`

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
`

const ARTICLE_FULL_FIELDS = `
  ${ARTICLE_CARD_FIELDS},
  body_en,
  body_ar,
  "tags": tags[]->{ _id, "slug": slug.current, name_en, name_ar }
`

// ─── Résolution par locale ─────────────────────────────────────────────────────

export function resolveArticle(raw: SanityArticle, locale: Locale) {
  const isAr = locale === 'ar'
  return {
    _id: raw._id,
    slug: raw.slug,
    title: isAr ? raw.title_ar : raw.title_en,
    excerpt: isAr ? raw.excerpt_ar : raw.excerpt_en,
    coverImage: raw.coverImage?.asset
      ? urlFor(raw.coverImage).width(1200).height(675).fit('crop').url()
      : '',
    coverImageAlt: isAr
      ? (raw.coverImage?.alt_ar ?? raw.coverImage?.alt_en ?? '')
      : (raw.coverImage?.alt_en ?? raw.coverImage?.alt_ar ?? ''),
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
        ? urlFor(raw.author.avatar).width(200).height(200).fit('crop').url()
        : undefined,
    },
    publishedAt: raw.publishedAt,
    readingTime: raw.readingTime ?? 5,
    featured: raw.featured ?? false,
    isExclusive: raw.isExclusive ?? false,
    body: isAr ? (raw.body_ar ?? []) : (raw.body_en ?? []),
  }
}

export function resolveCategory(raw: SanityCategory, locale: Locale) {
  return {
    _id: raw._id,
    slug: raw.slug,
    title: locale === 'ar' ? raw.name_ar : raw.name_en,
    description:
      locale === 'ar' ? raw.description_ar : raw.description_en,
    color: raw.color,
  }
}

// ─── Queries publiques ────────────────────────────────────────────────────────

/** Tous les articles triés par date desc */
export async function getAllArticles(locale: Locale) {
  const query = `*[_type == "article"] | order(publishedAt desc) {
    ${ARTICLE_CARD_FIELDS}
  }`
  const raw: SanityArticle[] = await sanityClient.fetch(query, {}, { next: { revalidate: 60 } })
  return raw.map((a) => resolveArticle(a, locale))
}

/** Article à la une (premier article featured, fallback sur le plus récent) */
export async function getFeaturedArticle(locale: Locale) {
  const query = `*[_type == "article" && featured == true] | order(publishedAt desc) [0] {
    ${ARTICLE_CARD_FIELDS}
  }`
  const raw: SanityArticle | null = await sanityClient.fetch(query, {}, { next: { revalidate: 60 } })
  if (raw) return resolveArticle(raw, locale)

  // Fallback : article le plus récent
  const fallbackQuery = `*[_type == "article"] | order(publishedAt desc) [0] { ${ARTICLE_CARD_FIELDS} }`
  const fallback: SanityArticle | null = await sanityClient.fetch(fallbackQuery, {}, { next: { revalidate: 60 } })
  return fallback ? resolveArticle(fallback, locale) : null
}

/** Articles les plus récents, excluant un ID, limités */
export async function getLatestArticles(locale: Locale, excludeId?: string, limit = 3) {
  const condition = excludeId ? `&& _id != $excludeId` : ''
  const query = `*[_type == "article" ${condition}] | order(publishedAt desc) [0...$limit] {
    ${ARTICLE_CARD_FIELDS}
  }`
  const raw: SanityArticle[] = await sanityClient.fetch(
    query,
    { excludeId: excludeId ?? '', limit },
    { next: { revalidate: 60 } }
  )
  return raw.map((a) => resolveArticle(a, locale))
}

/** Un article par slug */
export async function getArticleBySlug(slug: string, locale: Locale) {
  const query = `*[_type == "article" && slug.current == $slug][0] {
    ${ARTICLE_FULL_FIELDS}
  }`
  const raw: SanityArticle | null = await sanityClient.fetch(query, { slug }, { next: { revalidate: 60 } })
  if (!raw) return null
  return resolveArticle(raw, locale)
}

/** Articles d'une catégorie par slug de catégorie */
export async function getArticlesByCategory(categorySlug: string, locale: Locale) {
  const query = `*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    ${ARTICLE_CARD_FIELDS}
  }`
  const raw: SanityArticle[] = await sanityClient.fetch(
    query,
    { categorySlug },
    { next: { revalidate: 60 } }
  )
  return raw.map((a) => resolveArticle(a, locale))
}

/** Toutes les catégories */
export async function getAllCategories(locale: Locale) {
  const query = `*[_type == "category"] | order(name_en asc) {
    ${CATEGORY_FIELDS},
    description_en,
    description_ar
  }`
  const raw: SanityCategory[] = await sanityClient.fetch(query, {}, { next: { revalidate: 300 } })
  return raw.map((c) => resolveCategory(c, locale))
}

/** Toutes les catégories avec leur compte d'articles intégré (Résout le N+1) */
export async function getAllCategoriesWithCount(locale: Locale) {
  const query = `*[_type == "category"] | order(name_en asc) {
    ${CATEGORY_FIELDS},
    description_en,
    description_ar,
    "articleCount": count(*[_type == "article" && references(^._id)])
  }`
  
  const raw: (SanityCategory & { articleCount: number })[] = await sanityClient.fetch(
    query, 
    {}, 
    { next: { revalidate: 300 } }
  )
  
  return raw.map((c) => ({
    ...resolveCategory(c, locale),
    articleCount: c.articleCount ?? 0,
  }))
}

/** Slugs de tous les articles (pour generateStaticParams) */
export async function getAllArticleSlugs(): Promise<string[]> {
  const query = `*[_type == "article"]{ "slug": slug.current }.slug`
  return sanityClient.fetch(query)
}

/** Slugs de toutes les catégories (pour generateStaticParams) */
export async function getAllCategorySlugs(): Promise<string[]> {
  const query = `*[_type == "category"]{ "slug": slug.current }.slug`
  return sanityClient.fetch(query)
}
