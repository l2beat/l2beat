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
        'mb-8 rounded-lg border border-divider bg-surface-secondary p-4 md:p-6',
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
