import type { ChainNodeLayout } from './computeGraphLayout'
import { getConnectionPath } from './graphUtils'

interface Props {
  chainIds: string[]
  layout: Map<string, ChainNodeLayout>
  centerX: number
  centerY: number
}

/**
 * Renders a faint curved line for every unique chain pair,
 * so the "roads" between nodes are always visible in the background.
 */
export function BackgroundRoads({ chainIds, layout, centerX, centerY }: Props) {
  const pairs: { a: string; b: string }[] = []
  for (let i = 0; i < chainIds.length; i++) {
    for (let j = i + 1; j < chainIds.length; j++) {
      const a = chainIds[i]
      const b = chainIds[j]
      if (a && b) pairs.push({ a, b })
    }
  }

  return (
    <g>
      {pairs.map(({ a, b }) => {
        const srcLayout = layout.get(a)
        const dstLayout = layout.get(b)
        if (!srcLayout || !dstLayout) return null

        return (
          <path
            key={`road-${a}-${b}`}
            d={getConnectionPath(srcLayout, dstLayout, centerX, centerY)}
            fill="none"
            className="stroke-divider"
            strokeWidth={1}
            opacity={0.4}
          />
        )
      })}
    </g>
  )
}
