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
  hoveredChainId: string | null
}

const SECONDS_IN_DAY = 86_400
/** Each particle represents this many USD of volume. */
const DOLLARS_PER_PARTICLE = 50
/** Base travel time for a particle to cross the full path. */
const BASE_DURATION_S = 5
/** Per-flow upper bound to avoid excessive DOM nodes. */
const MAX_PARTICLES_PER_FLOW = 30
/** Global upper bound — if exceeded, all counts are scaled down proportionally. */
const MAX_TOTAL_PARTICLES = 450

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
  hoveredChainId,
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
  const cappedCounts = exactCounts.map((c) =>
    Math.min(c, MAX_PARTICLES_PER_FLOW),
  )

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
        const color = getChainColor(
          flow.srcChain,
          chainIndex,
          chainIds.length,
          true,
        )

        const highlighted =
          !hoveredChainId ||
          flow.srcChain === hoveredChainId ||
          flow.dstChain === hoveredChainId
        const groupOpacity = highlighted ? 1 : 0.15

        const exact = (cappedCounts[flowIndex] ?? 0) * globalScale

        if (exact < 1) {
          // Sub-1 flow: render 1 particle that still travels in exactly
          // BASE_DURATION_S, but with a longer gap between trips.
          // e.g. exact=0.2 → cycle=25s, particle visible for first 5s only.
          const cycleDuration = BASE_DURATION_S / Math.max(exact, 0.01)
          const t = BASE_DURATION_S / cycleDuration
          return (
            <g key={`${flow.srcChain}-${flow.dstChain}`} opacity={groupOpacity}>
              <circle r="2" fill={color}>
                <animateMotion
                  path={path}
                  dur={`${cycleDuration}s`}
                  keyPoints="0;1;1"
                  keyTimes={`0;${t};1`}
                  calcMode="linear"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  dur={`${cycleDuration}s`}
                  values="0.8;0.8;0;0"
                  keyTimes={`0;${t};${Math.min(t + 0.001, 0.999)};1`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )
        }

        const count = Math.round(exact)
        return (
          <g key={`${flow.srcChain}-${flow.dstChain}`} opacity={groupOpacity}>
            {Array.from({ length: count }, (_, i) => (
              <circle key={i} r="2" fill={color} opacity={0.8}>
                <animateMotion
                  path={path}
                  dur={`${BASE_DURATION_S}s`}
                  begin={`${(i / count) * BASE_DURATION_S}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )
      })}
    </g>
  )
}
