/**
 * schemas/siteSettings.ts
 *
 * Singleton document — one per dataset.
 * Controls global site configuration that editors can change
 * without a code deploy.
 *
 * Current fields:
 *  - homepageCategoryHighlight  — top-level category in homepage spotlight
 *  - headerCategories           — ordered array of top-level categories for header nav
 *  - footerCategories           — ordered array of top-level categories for footer "Editorial" column
 */

import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',

  // Singleton: editors can update and publish, but not create or delete.
  // (Action restrictions are now handled in sanity.config.ts)

  fields: [
    // ── Homepage ─────────────────────────────────────────────────────────────
    defineField({
      name: 'homepageCategoryHighlight',
      title: 'Homepage Category Highlight',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        filter: '!defined(parent)',
        disableNew: true,
      },
      description:
        'The top-level category shown in the homepage spotlight section.',
    }),

    // ── Header Navigation ─────────────────────────────────────────────────────
    defineField({
      name: 'headerCategories',
      title: 'Header Navigation Categories',
      type: 'array',
      description:
        'Top-level categories shown in the site header. Drag to reorder. Max 4 items.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'category' }],
          options: {
            // Only allow top-level categories (no parent defined)
            filter: '!defined(parent)',
            disableNew: true,
          },
        }),
      ],
      validation: (Rule) => Rule.max(4).unique(),
    }),

    // ── Footer Navigation ─────────────────────────────────────────────────────
    defineField({
      name: 'footerCategories',
      title: 'Footer Editorial Categories',
      type: 'array',
      description:
        'Top-level categories shown in the footer "Editorial" column. Drag to reorder. Leave empty to fall back to the same categories as the header.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'category' }],
          options: {
            // Only allow top-level categories (no parent defined)
            filter: '!defined(parent)',
            disableNew: true,
          },
        }),
      ],
      validation: (Rule) => Rule.max(6).unique(),
    }),
  ],

  preview: {
    select: {
      highlightName: 'homepageCategoryHighlight.name_en',
    },
    prepare({ highlightName }) {
      return {
        title: 'Site Settings',
        subtitle: highlightName
          ? `Homepage highlight: ${highlightName}`
          : 'No category configured',
      }
    },
  },
})

