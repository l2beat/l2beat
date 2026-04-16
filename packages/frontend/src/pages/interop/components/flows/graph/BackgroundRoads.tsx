import { useMemo } from 'react'
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

  const { activePaths, inactivePaths } = useMemo(() => {
    const active: string[] = []
    const inactive: string[] = []

    for (let i = 0; i < chainIds.length; i++) {
      for (let j = i + 1; j < chainIds.length; j++) {
        const a = chainIds[i]
        const b = chainIds[j]
        if (!a || !b) continue

        const srcLayout = layout.get(a)
        const dstLayout = layout.get(b)
        if (!srcLayout || !dstLayout) continue

        const highlighted =
          highlightedChains.length === 0 ||
          highlightedChains.every((chain) => chain === a || chain === b)

        const elements = [
          getConnectionPath(
            srcLayout,
            dstLayout,
            centerX,
            centerY,
            BIDIRECTIONAL_OFFSET,
          ),
          getConnectionPath(
            srcLayout,
            dstLayout,
            centerX,
            centerY,
            -BIDIRECTIONAL_OFFSET,
          ),
        ]

        if (highlighted) {
          active.push(...elements)
        } else {
          inactive.push(...elements)
        }
      }
    }

    return {
      activePaths: active.join(' '),
      inactivePaths: inactive.join(' '),
    }
  }, [chainIds, layout, centerX, centerY, highlightedChains])

  const activeStrokeWidth = highlightedChains.length > 0 ? 1.5 : 0.5

  return (
    <g pointerEvents="none" aria-hidden="true">
      {inactivePaths && (
        <path
          d={inactivePaths}
          fill="none"
          className="stroke-divider"
          strokeWidth={0.5}
          opacity={0.08}
        />
      )}
      {activePaths && (
        <path
          d={activePaths}
          fill="none"
          className="stroke-divider"
          strokeWidth={activeStrokeWidth}
          opacity={0.4}
        />
      )}
    </g>
  )
}
