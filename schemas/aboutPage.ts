/**
 * schemas/aboutPage.ts
 *
 * Singleton document — one per dataset.
 * Powers the public About page (src/app/[locale]/about/page.tsx) so
 * editors can update it without a code deploy.
 */

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',

  // Singleton: editors can update and publish, but not create, delete, or duplicate.
  // (Action restrictions are handled in sanity.config.ts)

  fields: [
    // ── Titles ──────────────────────────────────────────────────────────────
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'title_ar',
      title: 'Title (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),

    // ── Mission statement ──────────────────────────────────────────────────────
    defineField({
      name: 'mission_en',
      title: 'Mission (English)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: 'mission_ar',
      title: 'Mission (Arabic)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(400),
    }),

    // ── Hero image ─────────────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),

    // ── Rich body ──────────────────────────────────────────────────────────────
    defineField({
      name: 'body_en',
      title: 'Body (English)',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'body_ar',
      title: 'Body (Arabic)',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt text (Arabic)', type: 'string' },
            { name: 'caption', title: 'Caption (Arabic)', type: 'string' },
          ],
        },
      ],
    }),

    // ── SEO ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Overrides the default "About | ZINA Magazine" page title.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Overrides the mission statement as the meta description.',
    }),
  ],

  preview: {
    select: {
      title: 'title_en',
      media: 'heroImage',
    },
    prepare({ title, media }) {
      return {
        title: title || 'About Page',
        subtitle: 'Singleton',
        media,
      }
    },
  },
})
