import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    // ── Titres ──────────────────────────────────────────────────────────────
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

    // ── Slug ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title_en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // ── Extraits ─────────────────────────────────────────────────────────────
    defineField({
      name: 'excerpt_en',
      title: 'Excerpt (English)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'excerpt_ar',
      title: 'Excerpt (Arabic)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),

    // ── Image de couverture ───────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt_en',
          title: 'Alt text (English)',
          type: 'string',
        }),
        defineField({
          name: 'alt_ar',
          title: 'Alt text (Arabic)',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ── Relations ─────────────────────────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
    }),

    // ── Corps de l'article ────────────────────────────────────────────────────
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

    // ── Métadonnées éditoriales ───────────────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(120),
    }),
    defineField({
      name: 'featured',
      title: 'Featured article?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isExclusive',
      title: 'Exclusive (subscribers only)?',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'title_en',
      subtitle: 'category.name_en',
      media: 'coverImage',
    },
  },
})
