import { useInteropFlows } from '../utils/InteropFlowsContext'
import type { FlowsGraphLayout } from './utils/computeGraphLayout'
import {
  BIDIRECTIONAL_OFFSET,
  getConnectionPath,
} from './utils/getConnectionPath'

interface Props {
  chainIds: string[]
  layout: FlowsGraphLayout
  centerX: number
  centerY: number
}

/**
 * Renders two faint curved lines for every unique chain pair,
 * so the "roads" between nodes are always visible in the background.
 */
export function BackgroundRoads({ chainIds, layout, centerX, centerY }: Props) {
  const { highlightedChains } = useInteropFlows()

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
          highlightedChains.length === 0 ||
          highlightedChains.every((chain) => chain === a || chain === b)

        const strokeWidth =
          highlighted && highlightedChains.length > 0 ? 1.5 : 1
        const opacity = highlighted ? 0.4 : 0.08

        return (
          <g key={`road-${a}-${b}`}>
            <path
              d={getConnectionPath(
                srcLayout,
                dstLayout,
                centerX,
                centerY,
                BIDIRECTIONAL_OFFSET,
              )}
              fill="none"
              className="stroke-divider"
              strokeWidth={strokeWidth}
              opacity={opacity}
            />
            <path
              d={getConnectionPath(
                srcLayout,
                dstLayout,
                centerX,
                centerY,
                -BIDIRECTIONAL_OFFSET,
              )}
              fill="none"
              className="stroke-divider"
              strokeWidth={strokeWidth}
              opacity={opacity}
            />
          </g>
        )
      })}
    </g>
  )
}
