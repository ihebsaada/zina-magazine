import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name_en',
      title: 'Name (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name_ar',
      title: 'Name (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role_en',
      title: 'Role / Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'role_ar',
      title: 'Role / Title (Arabic)',
      type: 'string',
    }),
    defineField({
      name: 'bio_en',
      title: 'Bio (English)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'bio_ar',
      title: 'Bio (Arabic)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name_en', maxLength: 96 },
    }),
  ],
  preview: {
    select: {
      title: 'name_en',
      subtitle: 'role_en',
      media: 'avatar',
    },
  },
})
