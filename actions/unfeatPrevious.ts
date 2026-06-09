/**
 * actions/unfeatPrevious.ts
 *
 * Wraps the default Sanity Publish action for `article` documents.
 * When an editor publishes an article with `featured = true`, this action
 * automatically sets `featured = false` on every other published article
 * that currently has `featured = true`, enforcing a "one featured at a time"
 * rule at the editorial level with zero schema changes.
 */

import { useClient, type DocumentActionComponent } from 'sanity'

export function createUnfeatPreviousAction(
  OriginalPublishAction: DocumentActionComponent,
): DocumentActionComponent {
  const EnhancedPublishAction: DocumentActionComponent = (props) => {
    const originalResult = OriginalPublishAction(props)
    const client = useClient({ apiVersion: '2024-01-01' })

    // Read featured flag from the in-progress draft, falling back to published state
    const isFeatured = !!(props.draft?.featured ?? props.published?.featured)

    // Not being featured → delegate entirely to the original publish action
    if (!originalResult) return null
    if (!isFeatured) return originalResult

    return {
      ...originalResult,
      onHandle: async () => {
        try {
          // Find all OTHER published articles still carrying featured = true
          const otherIds = await client.fetch<string[]>(
            `*[
              _type == "article" &&
              featured == true &&
              _id != $id &&
              !(_id in path("drafts.**"))
            ]._id`,
            { id: props.id },
          )

          // Strip the featured flag from each of them
          if (otherIds.length > 0) {
            await Promise.all(
              otherIds.map((otherId) =>
                client.patch(otherId).set({ featured: false }).commit(),
              ),
            )
          }
        } catch (err) {
          // Log the error but do not block the publish.
          // The frontend's `featured != true` filter in getLatestArticles
          // acts as a secondary guard even if this patch fails.
          console.error('[unfeatPrevious] Could not unfeature previous article:', err)
        }

        // Run the original publish
        originalResult.onHandle?.()
      },
    }
  }

  return EnhancedPublishAction
}
