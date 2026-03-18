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
/** Base travel time for a particle to cross the full path. */
const BASE_DURATION_S = 3
/** Per-flow upper bound to avoid excessive DOM nodes. */
const MAX_PARTICLES_PER_FLOW = 30
/** Global upper bound — if exceeded, all counts are scaled down proportionally. */
const MAX_TOTAL_PARTICLES = 250

/**
 * Renders animated dots flowing along each connection path.
 * Uses SVG <animateMotion> so animation runs on the compositor
 * without JS re-renders.
 *
 * Particle count logic:
 *   volume is a 24h total → divide by 86400 to get $/second →
 *   divide by DOLLARS_PER_PARTICLE to get particles/second →
 *   multiply by BASE_DURATION_S to get how many particles are visible
 *   on the path at any given moment.
 *
 * For flows too small for even 1 particle, we still render 1 particle
 * but slow it down proportionally — e.g. a flow that computes to
 * 0.1 on-screen particles gets 1 particle with 10x the travel time,
 * so it appears infrequently, accurately reflecting low volume.
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

  // Compute the exact fractional on-screen particle count per flow
  const exactCounts = visibleFlows.map((flow) => {
    const volumePerSecond = flow.volume / SECONDS_IN_DAY
    const particlesPerSecond = volumePerSecond / DOLLARS_PER_PARTICLE
    return particlesPerSecond * BASE_DURATION_S
  })

  // Apply per-flow cap
  const cappedCounts = exactCounts.map((c) => Math.min(c, MAX_PARTICLES_PER_FLOW))

  // Apply global cap — scale all counts down proportionally if needed
  const totalCapped = cappedCounts.reduce((sum, c) => sum + Math.max(c, 1), 0)
  const globalScale =
    totalCapped > MAX_TOTAL_PARTICLES ? MAX_TOTAL_PARTICLES / totalCapped : 1

  return (
    <g>
      {visibleFlows.map((flow, flowIndex) => {
        const src = layout.get(flow.srcChain)
        const dst = layout.get(flow.dstChain)
        if (!src || !dst) return null

        const path = getConnectionPath(src, dst, centerX, centerY)
        const chainIndex = chainIds.indexOf(flow.srcChain)
        const color = getChainColor(chainIndex, chainIds.length, true)

        const exact = (cappedCounts[flowIndex] ?? 0) * globalScale

        if (exact < 1) {
          // Sub-1 flow: render 1 particle but slow it down so it appears
          // proportionally less often (e.g. 0.2 → 5x slower travel time)
          const duration = BASE_DURATION_S / Math.max(exact, 0.01)
          return (
            <circle
              key={`${flow.srcChain}-${flow.dstChain}-0`}
              r="2"
              fill={color}
              opacity={0.8}
            >
              <animateMotion
                path={path}
                dur={`${duration}s`}
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
          )
        }

        const count = Math.round(exact)
        return Array.from({ length: count }, (_, i) => (
          <circle
            key={`${flow.srcChain}-${flow.dstChain}-${i}`}
            r="2"
            fill={color}
            opacity={0.8}
          >
            <animateMotion
              path={path}
              dur={`${BASE_DURATION_S}s`}
              begin={`${(i / count) * BASE_DURATION_S}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))
      })}
    </g>
  )
}
