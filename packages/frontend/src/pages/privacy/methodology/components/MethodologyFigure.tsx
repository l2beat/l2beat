import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import type { PrivacyMethodologyFigureData } from '../getPrivacyMethodologyFigureData'

export type FigureData = PrivacyMethodologyFigureData

export function byId<T extends { id: string }>(items: T[], id: T['id']): T {
  const item = items.find((i) => i.id === id)
  if (!item) throw new Error('Unknown figure item', { cause: { id } })
  return item
}

export function MethodologyFigure({
  caption,
  className,
  children,
}: {
  caption: string
  className?: string
  children: ReactNode
}) {
  return (
    <figure
      className={cn(
        // On phones the figure spans the card, so the scene gets every pixel.
        '-mx-4 mb-8 border-divider border-y bg-surface-secondary p-4 md:mx-0 md:rounded-lg md:border-x md:p-6',
        className,
      )}
    >
      {children}
      <figcaption className="mt-4 text-paragraph-13 text-secondary">
        {caption}
      </figcaption>
    </figure>
  )
}
