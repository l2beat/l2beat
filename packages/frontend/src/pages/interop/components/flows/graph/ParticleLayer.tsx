import { UnixTime } from '@l2beat/shared-pure'
import type { Flow } from '~/server/features/scaling/interop/getInteropFlows'
import type { InteropChainWithIcon } from '../../chain-selector/types'
import {
  BASE_DURATION_S,
  DOLLARS_PER_PARTICLE,
  MAX_PARTICLES_PER_FLOW,
  MAX_TOTAL_PARTICLES,
  VOLUME_THRESHOLD_RATIO,
} from '../consts'
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

/**
 * Renders animated dots flowing along each connection path.
 * Particle count logic:
 *   volume in 24h total → divide by 86400 to get $/second →
 *   divide by DOLLARS_PER_PARTICLE to get particles/second →
 *   multiply by BASE_DURATION_S to get how many particles are visible
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

  // Compute the exact fractional on-screen particle count per flow
  const exactCounts = visibleFlows.map((flow) => {
    const volumePerSecond = flow.volume / UnixTime.DAY
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

        if (exact < 1) {
          // Sub-1 flow: render 1 particle that still travels in exactly
          // BASE_DURATION_S, but with a longer gap between trips.
          // e.g. exact=0.2 → cycle=25s, particle visible for first 5s only.
          const cycleDuration = BASE_DURATION_S / Math.max(exact, 0.01)
          const t = BASE_DURATION_S / cycleDuration
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
              const begin = `${(i / count) * BASE_DURATION_S}s`

              return (
                <circle key={i} r={particleRadius} fill={color} opacity={0}>
                  <animateMotion
                    path={path}
                    dur={`${BASE_DURATION_S}s`}
                    begin={begin}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    dur={`${BASE_DURATION_S}s`}
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
