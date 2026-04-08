import type { ChainNodeLayout } from './utils/computeGraphLayout'
import { getConnectionPath } from './utils/getConnectionPath'

interface Props {
  chainIds: string[]
  layout: Map<string, ChainNodeLayout>
  centerX: number
  centerY: number
  hoveredChainId: string | null
}

/**
 * Renders a faint curved line for every unique chain pair,
 * so the "roads" between nodes are always visible in the background.
 */
export function BackgroundRoads({
  chainIds,
  layout,
  centerX,
  centerY,
  hoveredChainId,
}: Props) {
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

        const highlighted =
          !hoveredChainId || a === hoveredChainId || b === hoveredChainId
        return (
          <path
            key={`road-${a}-${b}`}
            d={getConnectionPath(srcLayout, dstLayout, centerX, centerY)}
            fill="none"
            className="stroke-divider"
            strokeWidth={highlighted && hoveredChainId ? 1.5 : 1}
            opacity={highlighted ? 0.4 : 0.08}
          />
        )
      })}
    </g>
  )
}
