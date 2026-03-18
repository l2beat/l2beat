import type { ChainNodeLayout } from './computeGraphLayout'
import { getChainColor } from './getChainColor'

interface Flow {
  srcChain: string
  dstChain: string
  volume: number
}

interface Props {
  flows: Flow[]
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
  const threshold = maxVolume * 0.001

  return (
    <g>
      {flows.map((flow) => {
        if (flow.volume < threshold) return null

        const src = layout.get(flow.srcChain)
        const dst = layout.get(flow.dstChain)
        if (!src || !dst) return null

        const ratio = flow.volume / maxVolume
        const strokeWidth = MIN_STROKE + (MAX_STROKE - MIN_STROKE) * ratio

        const isHovered =
          hoveredChainId !== null &&
          (hoveredChainId === flow.srcChain ||
            hoveredChainId === flow.dstChain)

        const isHighlighted =
          isHovered ||
          (selectedChainIds.size > 0 &&
            (selectedChainIds.has(flow.srcChain) ||
              selectedChainIds.has(flow.dstChain)))

        const opacity = isHighlighted
          ? MAX_OPACITY * 2.5
          : MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * ratio

        const chainIndex = chainIds.indexOf(flow.srcChain)
        const color = getChainColor(chainIndex, chainIds.length)

        // Quadratic bezier curving toward center
        const midX = (src.x + dst.x) / 2
        const midY = (src.y + dst.y) / 2
        const curveFactor = 0.15
        const ctrlX = midX + (centerX - midX) * curveFactor
        const ctrlY = midY + (centerY - midY) * curveFactor

        const path = `M ${src.x} ${src.y} Q ${ctrlX} ${ctrlY} ${dst.x} ${dst.y}`

        return (
          <path
            key={`${flow.srcChain}-${flow.dstChain}`}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
            opacity={opacity}
          />
        )
      })}
    </g>
  )
}

export function getConnectionPath(
  srcLayout: ChainNodeLayout,
  dstLayout: ChainNodeLayout,
  centerX: number,
  centerY: number,
): string {
  const midX = (srcLayout.x + dstLayout.x) / 2
  const midY = (srcLayout.y + dstLayout.y) / 2
  const curveFactor = 0.15
  const ctrlX = midX + (centerX - midX) * curveFactor
  const ctrlY = midY + (centerY - midY) * curveFactor
  return `M ${srcLayout.x} ${srcLayout.y} Q ${ctrlX} ${ctrlY} ${dstLayout.x} ${dstLayout.y}`
}
