import { useId, useMemo } from 'react'
import { BubbleHolesClip } from './BubbleHolesClip'
import type { FlowsGraphLayout } from './utils/computeGraphLayout'
import { useFlowsGraph } from './utils/FlowsGraphContext'
import {
  BIDIRECTIONAL_OFFSET,
  getConnectionPath,
} from './utils/getConnectionPath'

interface Props {
  chainIds: string[]
  layout: FlowsGraphLayout
  centerX: number
  centerY: number
  centerChainId?: string
}

/**
 * Renders two faint curved lines for every unique chain pair,
 * so the "roads" between nodes are always visible in the background.
 * With a center chain only the spokes to it are drawn, one line each.
 */
export function BackgroundRoads({
  chainIds,
  layout,
  centerX,
  centerY,
  centerChainId,
}: Props) {
  const { highlightedChains } = useFlowsGraph()
  const clipId = `roads-clip-${useId().replace(/\W/g, '')}`

  const { activePaths, inactivePaths } = useMemo(() => {
    const active: string[] = []
    const inactive: string[] = []

    for (let i = 0; i < chainIds.length; i++) {
      for (let j = i + 1; j < chainIds.length; j++) {
        const a = chainIds[i]
        const b = chainIds[j]
        if (!a || !b) continue
        if (centerChainId && a !== centerChainId && b !== centerChainId) {
          continue
        }

        const srcLayout = layout.get(a)
        const dstLayout = layout.get(b)
        if (!srcLayout || !dstLayout) continue

        const highlighted = highlightedChains.every(
          (chain) => chain === a || chain === b,
        )

        const offsets = centerChainId
          ? [0]
          : [BIDIRECTIONAL_OFFSET, -BIDIRECTIONAL_OFFSET]
        const elements = offsets.map((offset) =>
          getConnectionPath(srcLayout, dstLayout, centerX, centerY, offset),
        )

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
  }, [chainIds, layout, centerX, centerY, highlightedChains, centerChainId])

  const activeStrokeWidth = highlightedChains.length > 0 ? 1.5 : 0.5

  return (
    <g pointerEvents="none" aria-hidden="true" clipPath={`url(#${clipId})`}>
      <BubbleHolesClip id={clipId} chainIds={chainIds} layout={layout} />
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
