/**
 * lib/sanity/image.ts
 *
 * Helper urlFor pour construire les URLs d'images Sanity optimisées.
 * Usage : urlFor(source).width(800).height(600).url()
 */
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
