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
}

const MAX_TOTAL_PARTICLES = 150
const MIN_PARTICLES = 1
const MAX_PARTICLES = 15
/** Each particle takes this many seconds to travel the full path. */
const DURATION_S = 3

/**
 * Renders animated dots flowing along each connection path.
 * Particle count per flow is proportional to its volume — higher-volume
 * connections get more particles. Uses SVG <animateMotion> so animation
 * runs on the compositor without JS re-renders.
 */
export function ParticleLayer({
  flows,
  layout,
  chainIds,
  centerX,
  centerY,
  maxVolume,
}: Props) {
  const threshold = maxVolume * VOLUME_THRESHOLD_RATIO
  const visibleFlows = flows.filter((f) => f.volume >= threshold)

  // More volume = more particles (1–15 per flow)
  const rawCounts = visibleFlows.map((flow) =>
    Math.round(lerp(MIN_PARTICLES, MAX_PARTICLES, flow.volume / maxVolume)),
  )

  // If too many particles total, scale all counts down proportionally
  const totalRaw = rawCounts.reduce((sum, c) => sum + c, 0)
  const scale =
    totalRaw > MAX_TOTAL_PARTICLES ? MAX_TOTAL_PARTICLES / totalRaw : 1

  return (
    <g>
      {visibleFlows.map((flow, flowIndex) => {
        const src = layout.get(flow.srcChain)
        const dst = layout.get(flow.dstChain)
        if (!src || !dst) return null

        const path = getConnectionPath(src, dst, centerX, centerY)
        const count = Math.max(1, Math.round((rawCounts[flowIndex] ?? 1) * scale))
        const chainIndex = chainIds.indexOf(flow.srcChain)
        const color = getChainColor(chainIndex, chainIds.length, true)

        return Array.from({ length: count }, (_, i) => (
          <circle
            key={`${flow.srcChain}-${flow.dstChain}-${i}`}
            r="2"
            fill={color}
            opacity={0.8}
          >
            {/* Stagger start times so particles are evenly distributed along the path */}
            <animateMotion
              path={path}
              dur={`${DURATION_S}s`}
              begin={`${(i / count) * DURATION_S}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))
      })}
    </g>
  )
}
