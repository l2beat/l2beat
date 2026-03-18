import type { ChainNodeLayout } from './computeGraphLayout'
import { getChainColor } from './getChainColor'
import {
  type GraphFlow,
  getConnectionPath,
  VOLUME_THRESHOLD_RATIO,
} from './graphUtils'

interface Props {
  flows: GraphFlow[]
  layout: Map<string, ChainNodeLayout>
  chainIds: string[]
  centerX: number
  centerY: number
  maxVolume: number
}

const SECONDS_IN_DAY = 86_400
/** Each particle represents this many USD of volume. */
const DOLLARS_PER_PARTICLE = 50
/** Each particle takes this many seconds to travel the full path. */
const DURATION_S = 3
/** Safety cap to keep the browser happy. */
const MAX_TOTAL_PARTICLES = 200
const MIN_PARTICLES_PER_FLOW = 1
const MAX_PARTICLES_PER_FLOW = 30

/**
 * Renders animated dots flowing along each connection path.
 * Uses SVG <animateMotion> so animation runs on the compositor
 * without JS re-renders.
 *
 * Particle count logic:
 *   volume is a 24h total → divide by 86400 to get $/second →
 *   divide by DOLLARS_PER_PARTICLE to get particles/second →
 *   multiply by DURATION_S to get how many particles are visible
 *   on the path at any given moment.
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

  const rawCounts = visibleFlows.map((flow) => {
    const volumePerSecond = flow.volume / SECONDS_IN_DAY
    const particlesPerSecond = volumePerSecond / DOLLARS_PER_PARTICLE
    // How many particles are on-screen at once (traveling for DURATION_S seconds)
    const onScreen = particlesPerSecond * DURATION_S
    return Math.min(
      MAX_PARTICLES_PER_FLOW,
      Math.max(MIN_PARTICLES_PER_FLOW, Math.round(onScreen)),
    )
  })

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
        const count = Math.max(
          1,
          Math.round((rawCounts[flowIndex] ?? 1) * scale),
        )
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
