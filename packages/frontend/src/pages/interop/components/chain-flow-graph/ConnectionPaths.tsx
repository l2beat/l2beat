import type { ChainNodeLayout } from './computeGraphLayout'
import { getChainColor } from './getChainColor'
import {
  type GraphFlow,
  VOLUME_THRESHOLD_RATIO,
  getConnectionPath,
  lerp,
} from './graphUtils'

interface Props {
  flows: GraphFlow[]
  layout: Map<string, ChainNodeLayout>
  chainIds: string[]
  centerX: number
  centerY: number
  maxVolume: number
  selectedChainIds: Set<string>
  hoveredChainId: string | null
}

const MIN_STROKE = 0.5
const MAX_STROKE = 3
const MIN_OPACITY = 0.05
const MAX_OPACITY = 0.25

/**
 * Renders colored bezier paths for each flow with volume above the threshold.
 * Stroke width and opacity scale with the flow's share of maxVolume.
 */
export function ConnectionPaths({
  flows,
  layout,
  chainIds,
  centerX,
  centerY,
  maxVolume,
  selectedChainIds,
  hoveredChainId,
}: Props) {
  const threshold = maxVolume * VOLUME_THRESHOLD_RATIO

  return (
    <g>
      {flows.map((flow) => {
        if (flow.volume < threshold) return null

        const src = layout.get(flow.srcChain)
        const dst = layout.get(flow.dstChain)
        if (!src || !dst) return null

        const ratio = flow.volume / maxVolume
        const strokeWidth = lerp(MIN_STROKE, MAX_STROKE, ratio)

        const touchesHovered =
          hoveredChainId === flow.srcChain || hoveredChainId === flow.dstChain
        const touchesSelected =
          selectedChainIds.has(flow.srcChain) ||
          selectedChainIds.has(flow.dstChain)
        const isHighlighted =
          touchesHovered || (selectedChainIds.size > 0 && touchesSelected)

        const opacity = isHighlighted
          ? MAX_OPACITY * 2.5
          : lerp(MIN_OPACITY, MAX_OPACITY, ratio)

        const chainIndex = chainIds.indexOf(flow.srcChain)
        const color = getChainColor(chainIndex, chainIds.length)
        const path = getConnectionPath(src, dst, centerX, centerY)

        return (
          <path
            key={`${flow.srcChain}-${flow.dstChain}`}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={touchesHovered ? strokeWidth + 1 : strokeWidth}
            opacity={opacity}
          />
        )
      })}
    </g>
  )
}
