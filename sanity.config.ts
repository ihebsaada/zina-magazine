import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import article from './schemas/article'
import category from './schemas/category'
import author from './schemas/author'
import tag from './schemas/tag'
import siteSettings from './schemas/siteSettings'
import adBanner from './schemas/adBanner'
import aboutPage from './schemas/aboutPage'

import { structure } from './sanity.structure'
import { createUnfeatPreviousAction } from './actions/unfeatPrevious'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'ZINA-magazine',
  title: 'ZINA Magazine',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  schema: {
    types: [article, category, author, tag, siteSettings, adBanner, aboutPage],
  },

  document: {
    actions: (prev, ctx) => {
      // Singleton rules: prevent create, delete, duplicate, unpublish for siteSettings/aboutPage
      if (ctx.schemaType === 'siteSettings' || ctx.schemaType === 'aboutPage') {
        const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
        return prev.filter(({ action }) => action && singletonActions.has(action))
      }

      // Wrap the default Publish action only for article documents
      if (ctx.schemaType === 'article') {
        return prev.map((action) =>
          action.action === 'publish'
            ? createUnfeatPreviousAction(action)
            : action,
        )
      }

      return prev
    },
  },
})
