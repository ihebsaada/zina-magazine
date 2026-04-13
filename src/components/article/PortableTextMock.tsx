import Image from 'next/image'
import type { ArticleBlock } from '@/types/magazine'
import { cn } from '@/lib/utils'

interface PortableTextMockProps {
  blocks: ArticleBlock[]
  className?: string
}

export function PortableTextMock({ blocks, className }: PortableTextMockProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className={cn('prose-editorial', className)}>
      {blocks.map((block) => {
        switch (block._type) {
          case 'paragraph':
            return (
              <p key={block._key}>
                {block.content}
              </p>
            )
          
          case 'heading':
            const Tag = `h${block.level}` as import('react').ElementType
            return (
              <Tag key={block._key}>
                {block.content}
              </Tag>
            )
          
          case 'blockquote':
            return (
              <blockquote key={block._key}>
                <p>{block.content}</p>
                {block.attribution && (
                  <cite>&mdash; {block.attribution}</cite>
                )}
              </blockquote>
            )
          
          case 'image':
            return (
              <figure key={block._key} className="my-12">
                <div className="relative w-full overflow-hidden bg-[var(--color-ink-100)] aspect-[16/9]">
                  <Image
                    src={block.url}
                    alt={block.alt || ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center mt-3 text-[var(--color-ink-500)] text-[var(--text-caption)]">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )
          
          default:
            return null
        }
      })}
    </div>
  )
}
