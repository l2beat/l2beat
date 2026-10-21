import type { ReactNode } from 'react'

export function MethodologyFigure({
  caption,
  children,
}: {
  caption?: string
  children: ReactNode
}) {
  return (
    <figure
      // On phones the figure spans the card, so the scene gets every pixel.
      className="-mx-4 mb-8 border-divider border-y bg-surface-secondary p-4 md:mx-0 md:rounded-lg md:border-x md:p-6"
    >
      {children}
      {caption && (
        <figcaption className="mt-4 text-paragraph-13 text-secondary">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
