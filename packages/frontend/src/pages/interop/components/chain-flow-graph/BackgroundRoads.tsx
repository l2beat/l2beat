import { getConnectionPath } from './ConnectionPaths'
import type { ChainNodeLayout } from './computeGraphLayout'

interface Props {
  chainIds: string[]
  layout: Map<string, ChainNodeLayout>
  centerX: number
  centerY: number
}

export function BackgroundRoads({ chainIds, layout, centerX, centerY }: Props) {
  const pairs: { a: string; b: string }[] = []
  for (let i = 0; i < chainIds.length; i++) {
    for (let j = i + 1; j < chainIds.length; j++) {
      pairs.push({ a: chainIds[i]!, b: chainIds[j]! })
    }
  }

  return (
    <g>
      {pairs.map(({ a, b }) => {
        const srcLayout = layout.get(a)
        const dstLayout = layout.get(b)
        if (!srcLayout || !dstLayout) return null

        const path = getConnectionPath(srcLayout, dstLayout, centerX, centerY)

        return (
          <path
            key={`road-${a}-${b}`}
            d={path}
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
