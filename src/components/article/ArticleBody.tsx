'use client'

/**
 * components/article/ArticleBody.tsx
 *
 * Rendu du Portable Text Sanity avec le design system éditorial du magazine.
 * Remplace PortableTextMock — branché sur @portabletext/react.
 * Prop `body` accepte les blocs Sanity bruts (any[]).
 */
import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/lib/sanity/image'
import { cn } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ArticleBodyProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[]
  className?: string
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed text-[var(--color-ink-800)]">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-editorial text-[var(--text-headline)] text-[var(--color-ink-950)] mt-12 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-editorial text-[var(--text-subhead)] text-[var(--color-ink-900)] mt-8 mb-3 leading-tight">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-s-[3px] border-[var(--color-oree)] ps-6 my-8 italic text-[1.125rem] text-[var(--color-ink-600)] leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[var(--color-ink-950)]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-oree)] underline underline-offset-2 hover:text-[var(--color-oree-dark)] transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-[var(--color-ink-800)]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 text-[var(--color-ink-800)]">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  types: {
    // Images inline dans l'article
    image: ({ value }) => {
      if (!value?.asset) return null
      const imageUrl = urlFor(value).width(1000).url()
      return (
        <figure className="my-12">
          <div className="relative w-full overflow-hidden bg-[var(--color-ink-100)] aspect-[16/9]">
            <Image
              src={imageUrl}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center mt-3 text-[var(--color-ink-500)] text-[var(--text-caption)] italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export function ArticleBody({ body, className }: ArticleBodyProps) {
  if (!body || body.length === 0) {
    return (
      <div className={cn('prose-editorial text-[var(--color-ink-600)] italic', className)}>
        <p>Content coming soon…</p>
      </div>
    )
  }

  return (
    <div className={cn('prose-editorial', className)}>
      <PortableText value={body} components={components} />
    </div>
  )
}
