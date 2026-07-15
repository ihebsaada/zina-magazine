/**
 * sanity.structure.ts
 *
 * Custom desk structure for ZINA Magazine Studio.
 *
 * Navigation hierarchy:
 *   Content
 *   └── [Top-level Category]          ← categories where parent is NOT defined
 *       └── [SubCategory]             ← categories where parent._ref == categoryId
 *           └── [Article]             ← articles where category._ref == subCategoryId
 *
 * Flat utilities (for fast access):
 *   ├── All Articles
 *   ├── All Categories
 *   ├── Authors
 *   └── Tags
 */

import type { StructureResolver } from 'sanity/structure'
import {
  FolderIcon,        // Content browser
  DocumentsIcon,     // All Articles
  TagsIcon,          // All Categories
  UsersIcon,         // Authors
  TagIcon,           // Tags
  CogIcon,           // Site Settings
  ImagesIcon,        // Ad Banners
} from '@sanity/icons'

// Matches your NEXT_PUBLIC_SANITY_API_VERSION or any recent stable date.
const API_VERSION = '2024-01-01'

export const structure: StructureResolver = (S) => {
  return S.list()
    .title('ZINA Magazine')
    .items([
      // ── Hierarchical content browser ────────────────────────────────────────
      S.listItem()
        .title('Content')
        .icon(FolderIcon)
        .child(
          // Level 1: Top-level categories (parent is NOT defined)
          S.documentTypeList('category')
            .title('Categories')
            .apiVersion(API_VERSION)
            .filter('_type == "category" && !defined(parent)')
            .child((categoryId) =>
              // Level 2: SubCategories that belong to this category
              S.documentTypeList('category')
                .title('SubCategories')
                .apiVersion(API_VERSION)
                .filter('_type == "category" && parent._ref == $categoryId')
                .params({ categoryId })
                .child((subCategoryId) =>
                  // Level 3: Articles assigned to this subcategory
                  S.documentTypeList('article')
                    .title('Articles')
                    .apiVersion(API_VERSION)
                    .filter('_type == "article" && category._ref == $subCategoryId')
                    .params({ subCategoryId })
                )
            )
        ),

      // ── Site Settings singleton ──────────────────────────────────────────────
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),

      S.divider(),

      // ── Flat utility lists ───────────────────────────────────────────────────
      S.listItem()
        .title('All Articles')
        .icon(DocumentsIcon)
        .child(
          S.documentTypeList('article')
            .title('All Articles')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),

      S.listItem()
        .title('All Categories')
        .icon(TagsIcon)
        .child(
          S.documentTypeList('category')
            .title('All Categories')
        ),

      S.listItem()
        .title('Authors')
        .icon(UsersIcon)
        .child(
          S.documentTypeList('author')
            .title('Authors')
        ),

      S.listItem()
        .title('Tags')
        .icon(TagIcon)
        .child(
          S.documentTypeList('tag')
            .title('Tags')
        ),

      S.listItem()
        .title('Ad Banners')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('adBanner')
            .title('Ad Banners')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
    ])
}

