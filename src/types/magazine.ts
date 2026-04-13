/**
 * types/magazine.ts
 *
 * Types TypeScript partagés reflétant la structure future des documents Sanity.
 * Objectif : rendre la migration CMS aussi transparente que possible.
 */

// ─── Localisation (Hybride CMS) ────────────────────────────────────────────────

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface LocalizedBlocks {
  en: ArticleBlock[];
  ar: ArticleBlock[];
}

// ─── Types pour l'UI Frontend (Données résolues par langue) ───────────────────

export interface Article {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt?: string;
  category: Category;
  author: Author;
  publishedAt: string; // ISO 8601
  readingTime: number; // minutes
  featured?: boolean;
  body: ArticleBlock[];
  tags?: string[];
  likes?: number;
  comments?: ArticleComment[];
}

export type ArticleCard = Pick<
  Article,
  | "_id"
  | "slug"
  | "title"
  | "excerpt"
  | "coverImage"
  | "coverImageAlt"
  | "category"
  | "author"
  | "publishedAt"
  | "readingTime"
  | "featured"
>;

export interface Author {
  _id: string;
  name: string;
  bio?: string;
  avatar?: string;
  role?: string;
}

export interface Category {
  _id: string;
  slug: string;
  title: string;
  color?: string;
  subcategories?: Category[];
}

// ─── Article blocks (Portable Text Sanity) ────────────────────────────────────

export type ArticleBlock =
  | ParagraphBlock
  | HeadingBlock
  | BlockquoteBlock
  | ImageBlock;

export interface ParagraphBlock {
  _key: string;
  _type: "paragraph";
  content: string;
}

export interface HeadingBlock {
  _key: string;
  _type: "heading";
  level: 2 | 3;
  content: string;
}

export interface BlockquoteBlock {
  _key: string;
  _type: "blockquote";
  content: string;
  attribution?: string;
}

export interface ImageBlock {
  _key: string;
  _type: "image";
  url: string;
  alt?: string;
  caption?: string;
}

// ─── Commentaires (UI only) ───────────────────────────────────────────────────

export interface ArticleComment {
  _id: string;
  author: string;
  avatar?: string;
  content: string;
  publishedAt: string;
  likes?: number;
}

// ─── Types bruts pour la BDD / Mocks (Avant résolution de la langue) ──────────

export interface RawCategory extends Omit<Category, "title"> {
  title: LocalizedString;
}

export interface RawAuthor extends Omit<Author, "name" | "bio" | "role"> {
  name: LocalizedString;
  bio?: LocalizedString;
  role?: LocalizedString;
}

export interface RawArticle extends Omit<
  Article,
  "title" | "excerpt" | "body" | "category" | "author"
> {
  title: LocalizedString;
  excerpt: LocalizedString;
  body: LocalizedBlocks;
  category: RawCategory;
  author: RawAuthor;
}
