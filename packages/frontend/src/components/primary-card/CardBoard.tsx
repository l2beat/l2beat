import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/**
 * One card for several `PrimaryCard`s, split by lines instead of grey gaps
 * (see `board` in card-board.css). From md only: phones already run cards
 * edge to edge with a line between them.
 */
export function CardBoard({
  className,
  layoutClassName,
  children,
}: {
  className?: string
  /** Lays out the cards, e.g. `grid lg:grid-cols-2`. */
  layoutClassName?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'md:rounded-xl md:bg-surface-primary md:px-6 md:py-5',
        className,
      )}
    >
      <div className={cn('md:board md:board-gap', layoutClassName)}>
        {children}
      </div>
    </div>
  )
}
