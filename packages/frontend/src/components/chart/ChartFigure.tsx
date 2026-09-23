import type { ReactNode } from 'react'
import { CustomLink } from '~/components/link/CustomLink'

interface Props {
  /** Server-computed summary of the chart; the chart itself only draws after hydration */
  caption: string
  /** Public endpoint serving the charted series, if there is one */
  jsonUrl?: string
  children: ReactNode
}

/**
 * Gives a client-rendered chart a text equivalent that exists in the
 * server-rendered HTML. The caption is visually hidden because the chart and
 * its stats panel already show the same numbers to sighted users.
 */
export function ChartFigure({ caption, jsonUrl, children }: Props) {
  return (
    <figure>
      {children}
      {jsonUrl && (
        <div className="mt-2 flex justify-end">
          <CustomLink
            href={jsonUrl}
            type="application/json"
            className="text-label-value-12"
          >
            JSON
          </CustomLink>
        </div>
      )}
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  )
}
