import { UnixTime } from '@l2beat/shared-pure'
import type { Flow } from '~/server/features/scaling/interop/getInteropFlows'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import type { FlowsGraphLayout } from './utils/computeGraphLayout'
import { getChainColor } from './utils/getChainColor'
import {
  BIDIRECTIONAL_OFFSET,
  getConnectionPath,
} from './utils/getConnectionPath'

interface Props {
  flows: Flow[]
  layout: FlowsGraphLayout
  interopChains: InteropChainWithIcon[]
  centerX: number
  centerY: number
  maxVolume: number
  isSmallScreen: boolean
}

// Each particle represents 50 USD of volume
export const DOLLARS_PER_PARTICLE = 50
// Travel time for a particle to cross the longest visible path.
// All other paths travel at the same speed, so shorter paths take less time.
const MAX_DURATION_S = 5
// Minimum per-flow travel time so very short paths don't blur into a line
const MIN_DURATION_S = 0.5
// Per-flow upper bound to avoid excessive DOM nodes
const MAX_PARTICLES_PER_FLOW = 50
// Global upper bound — if exceeded, all counts are scaled down proportionally
const MAX_TOTAL_PARTICLES = 700
// Flows below this fraction of the max volume are hidden to reduce visual noise
export const VOLUME_THRESHOLD_RATIO = 0.001

/**
 * Renders animated dots flowing along each connection path.
 *
 * Particles move at a constant speed across the graph: the longest visible
 * flow takes MAX_DURATION_S, and shorter flows take proportionally less time
 * (based on the straight-line src→dst distance, which closely approximates
 * the mildly-curved bezier path).
 *
 * Particle count logic:
 *   volume in 24h total → divide by 86400 to get $/second →
 *   divide by DOLLARS_PER_PARTICLE to get particles/second →
 *   multiply by per-flow duration to get how many particles are visible
 *   on the path at any given moment
 *
 * For flows too small for even 1 particle, we still render 1 particle
 * but slow it down proportionally — e.g. a flow that computes to
 * 0.1 on-screen particles gets 1 particle with 10x the travel time
 */
export function ParticleLayer({
  flows,
  layout,
  interopChains,
  centerX,
  centerY,
  maxVolume,
  isSmallScreen,
}: Props) {
  const { highlightedChains } = useInteropFlows()
  const particleRadius = isSmallScreen ? 1.5 : 2
  const threshold = maxVolume * VOLUME_THRESHOLD_RATIO
  const visibleFlows = flows.filter((f) => f.volume >= threshold)

  // Straight-line distance per flow (closely approximates the curved path length)
  const distances = visibleFlows.map((flow) => {
    const src = layout.get(flow.srcChain)
    const dst = layout.get(flow.dstChain)
    if (!src || !dst) return 0
    const dx = dst.x - src.x
    const dy = dst.y - src.y
    return Math.sqrt(dx * dx + dy * dy)
  })
  const maxDistance = Math.max(1, ...distances)

  // Per-flow duration — constant speed across the graph, with a floor so
  // very short paths don't become visually jittery.
  const durations = distances.map((d) =>
    Math.max(MIN_DURATION_S, MAX_DURATION_S * (d / maxDistance)),
  )

  // Compute the exact fractional on-screen particle count per flow.
  // Uses per-flow duration so the spawn rate (particles/second) stays
  // tied to volume regardless of how long the particle is on-screen.
  const exactCounts = visibleFlows.map((flow, i) => {
    const volumePerSecond = flow.volume / UnixTime.DAY
    const particlesPerSecond = volumePerSecond / DOLLARS_PER_PARTICLE
    return particlesPerSecond * (durations[i] ?? MAX_DURATION_S)
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

        const path = getConnectionPath(
          src,
          dst,
          centerX,
          centerY,
          BIDIRECTIONAL_OFFSET,
        )
        const color = getChainColor(interopChains, flow.srcChain)

        const highlighted =
          highlightedChains.length === 0 ||
          highlightedChains.every(
            (chain) => chain === flow.srcChain || chain === flow.dstChain,
          )

        const groupOpacity = highlighted ? 1 : 0.15

        const exact = (cappedCounts[flowIndex] ?? 0) * globalScale
        const duration = durations[flowIndex] ?? MAX_DURATION_S

        if (exact < 1) {
          // Sub-1 flow: render 1 particle that still travels in exactly
          // `duration`, but with a longer gap between trips.
          // e.g. exact=0.2 → cycle=5×duration, particle visible for the first `duration` only.
          const cycleDuration = duration / Math.max(exact, 0.01)
          const t = duration / cycleDuration
          return (
            <g key={`${flow.srcChain}-${flow.dstChain}`} opacity={groupOpacity}>
              <circle r={particleRadius} fill={color} opacity={0}>
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
            {Array.from({ length: count }, (_, i) => {
              const begin = `${(i / count) * duration}s`

              return (
                <circle key={i} r={particleRadius} fill={color} opacity={0}>
                  <animateMotion
                    path={path}
                    dur={`${duration}s`}
                    begin={begin}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    dur={`${duration}s`}
                    begin={begin}
                    values="0;0.8;0.8;0"
                    keyTimes="0;0.001;0.999;1"
                    repeatCount="indefinite"
                  />
                </circle>
              )
            })}
          </g>
        )
      })}
    </g>
  )
}
