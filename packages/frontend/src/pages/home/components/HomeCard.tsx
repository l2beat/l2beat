import type { ComponentProps } from 'react'
import { cn } from '~/utils/cn'

/**
 * A section of the home page. There are no boxes: sections sit straight on the
 * page background, a hairline above each, and the page grid adds the lines
 * between columns. The page itself has no side padding, so a section pads its
 * content by the page gutter and its hairline runs edge to edge; a section
 * beside a column line swaps that side for 24px.
 */
export function HomeCard({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'min-w-0 border-divider border-t px-(--home-gutter) py-6',
        className,
      )}
      {...props}
    />
  )
}
